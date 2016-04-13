var Datastore = require('nedb');

var db = {};
db.authors = new Datastore({filename: 'databases/authors.db', autoload: true});
db.posts = new Datastore({filename: 'databases/posts.db', autoload: true});
db.categories = new Datastore({filename: 'databases/categories.db', autoload: true});

module.exports = db;