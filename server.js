/* globals */
global.CRUD_MAIN_DIR = __dirname;

'use strict';

const morgan = require('morgan')
const busboy = require('connect-busboy');
const bodyParser = require('body-parser');
const express = require('express');
const https = require('https');
const http = require('http');
const MongoClient = require('mongodb').MongoClient;
const f = require('util').format;
const session = require('express-session');
const redis = require("redis");
const RedisStore = require('connect-redis')(session);
const fs = require('fs');
const path = require('path'); 
const routes = require('./routes.js');

function server() {
  /* get express server object */
  var app = express();
  
  /* disable this http header */
  app.disable('x-powered-by');
  
  /* enable json & x-www-form-urlencoded bodies */
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true })); 
  
  /* enable static assets directory */
  app.use('/static',express.static(__dirname + '/static'));
  
  /* enable morgan for access logs */
  app.use(morgan('combined'));
  
  /* enable ejs for templating */
  app.set('view engine', 'ejs');
  
  /* enable busboy for file uploads */
  app.use(busboy({}));
  
  /* enable Mongo */
  const mhost = "mongo";
  const mdatabase = "db";
  const authMechanism = 'DEFAULT';
  
  const mongourl = f('mongodb://%s/%s?authMechanism=%s',mhost,mdatabase,authMechanism);
  
  let MongoDB;
  MongoClient.connect(mongourl,function(err,db) {
  	if(err) {
  		console.error(err + '\n');
  		process.exit();
  	} else {
    	MongoDB = db;
  		app.set("_db",db);
  	}
  });
  
  /* enable redis for sessions */
  sessionStore = new RedisStore({
  	host: "localhost",
  	port: 6379,
  	client: redis.createClient(),
  	db: 0,
  	disableTTL: true,
  	prefix: 'session:'
  });
  
  if(sessionStore !== null) {
  	app.use(session({
  		key : "crud_key",
  		secret: "crud_secret",
  		resave: false,
  		saveUninitialized: false,
  		store: sessionStore
  	}));
  } else {
    console.error('Error creating Redis session store\n');
    process.exit();
  }
  
  /* grab the configuration file & create routes */
  
  fs.readFile('./config/data.json', {encoding: 'utf-8'}, function(err, data) {
    if (err) {
      console.error('Could not open configuration file' + err + '\n');
      process.exit();
    } else {
      let config;
      try {
        config = JSON.parse(data);
      } catch(err) {
        app.all('*',function(request,response) {
      		response.status(500);
      		response.end('Error opening config file: ' + String(err));
      	});
      	
      	http.createServer(app).listen(80,function() {
    			console.log("CRUD http server listening at 80");
    		});
    		
    		const privateKey = fs.readFileSync('/crud/ssl/crud.key');
    		const certificate = fs.readFileSync('/crud/ssl/crud.crt');
    		
    		/* start https server */
    		https.createServer({
    	    key: privateKey,
    	    cert: certificate
    		}, app).listen(443,function() {
    			console.log("CRUD http server listening at 443");
    		});
    		
    		return;
      }
      
      app.get('/',routes.domains);
      
      let domains = [];
      for (let path in config) {
        if (path.indexOf('/') < 0) {
          path = '/' + path;
        }
        
        if ((path.match(/\//g) || []).length === 1) {
          app.get(path,routes.create);
          app.get(path + '/:field/:value',routes.get);
          app.post(path + '/:field/:value',routes.post);
          app.put(path,routes.put);
          app.delete(path + '/:field/:value',routes.delete);
          app.set(path.split('/')[1],config[path]);
          MongoDB.createCollection(path.split('/')[1]);
          domains.push(path.split('/')[1]);
        } else {
          console.log("Error: Paths can not be nested > " + path);
        }
      }
      app.set('domains',domains);
      
      app.all('*',function(request,response) {
    		response.status(404);
    		response.end("CRUD Path Not Found");
    	});
    	
    	http.createServer(app).listen(80,function() {
  			console.log("CRUD http server listening at 80");
  		});
  		
  		const privateKey = fs.readFileSync('/crud/ssl/crud.key');
  		const certificate = fs.readFileSync('/crud/ssl/crud.crt');
  		
  		/* start https server */
  		https.createServer({
  	    key: privateKey,
  	    cert: certificate
  		}, app).listen(443,function() {
  			console.log("CRUD http server listening at 443");
  		});
    }
  });
  
  process.on('SIGINT',function() {
  	// place any clean up here
      process.exit();
  });
}

server();





















