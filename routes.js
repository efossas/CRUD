// landing page (show domains)
exports.domains = require('./routes/domains.js').route;

// landing page for record creation
exports.create = require('./routes/create.js').route;

// create
exports.put = require('./routes/put.js').route;

// read
exports.get = require('./routes/get.js').route;

// update
exports.post = require('./routes/post.js').route;

// delete
exports.delete = require('./routes/delete.js').route;