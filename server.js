/* globals */
global.CRUD_MAIN_DIR = __dirname;

'use strict';

const busboy = require('connect-busboy');
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
const route = require('./route.js');

/* get express server object */
var app = express();

/* disable this http header */
app.disable('x-powered-by');

/* enable busboy */
app.use(busboy({}));

/* enable Mongo */
const muser = encodeURIComponent("admin");
const mpassword = encodeURIComponent("default");
const mhost = "localhost";
const mdatabase = "db";
const authMechanism = 'DEFAULT';

const mongourl = f('mongodb://%s:%s@%s/%s?authMechanism=%s',muser,mpassword,mhost,mdatabase,authMechanism);

MongoClient.connect(mongourl,function(err,db) {
	if(err) {
		console.error('Mongo db connection error: ' + err + '\n');
		process.exit();
	} else {
		app.set("db",db);
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
  console.error('Error createing Redis session store\n');
  process.exit();
}

/* grab the configuration file & create routes */

fs.readFile('/config/data.json', {encoding: 'utf-8'}, function(err, data) {
  if (err) {
    console.error('Could not open configuration file' + err + '\n');
    process.exit();
  } else {
    const config = JSON.parse(data);
    
    for (let path in config) {
      app.post(path,route);
      app.set(path,config[path]);
    }
    
    app.all('*',function(request,response) {
  		response.status(404);
  		response.end("Page Not Found");
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























