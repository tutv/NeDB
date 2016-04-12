var express = require('express');
var app = express();
var http = require('http').Server(app);
var datek = require('datek');

var Datastore = require('nedb');

var db = {};
db.authors = new Datastore({filename: 'databases/authors.db', autoload: true});
db.posts = new Datastore({filename: 'databases/posts.db', autoload: true});
db.categories = new Datastore({filename: 'databases/categories.db', autoload: true});

app.get('/destroy', function (req, res) {
    db.posts.remove({}, {multi: true}, function (err, numRemoved) {
    });

    db.authors.remove({}, {multi: true}, function (err, numRemoved) {
    });

    res.send('Done!');
});

app.get('/seedCat', function (req, res) {
    var categories = [
        {
            name: 'Android'
        },
        {
            name: 'PHP'
        },
        {
            name: 'Java'
        }
    ];
    db.categories.insert(categories, function (err, docs) {
        res.json(docs);
    });
});

app.get('/seed', function (req, res) {
    var author = {
        name: 'Tu Tran',
        username: 'max',
        created_at: datek.getNowTimestamp(),
        updated_at: datek.getNowTimestamp()
    };

    db.authors.insert(author, function (err, newAuthor) {
        var author_id = newAuthor._id;

        var post = {
            title: 'Hello world!',
            content: 'In the follow-on blogs in this series, you’ll see how the data from a home sale.',
            author: newAuthor,
            categories: [],
            created_at: datek.getNowTimestamp(),
            updated_at: datek.getNowTimestamp()
        };
        db.posts.insert(post, function (err, newPost) {
            console.log(newPost);
        });
    });

    res.send('Hello!');
});

app.get('/posts', function (req, res) {
    db.posts.find({}, function (err, docs) {
        db.authors.find({}, function (errr, authors) {
            docs.forEach(function (post, index) {

            });
        });

        res.json(docs);
    });
});

http.listen(8001, function () {
    console.log('listening on localhost:8001');
});