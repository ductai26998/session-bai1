const low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
var db = low(adapter);

// our default array of dreams
db.defaults({books: [], 
			sessions: [],
            users: [],
            transactions: []})
  .write();
module.exports = db;