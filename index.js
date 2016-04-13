var express = require('express');
var app = express();
var http = require('http').Server(app);
var datek = require('datek');
var db = require('./nedb');
var genK = require('./generate');

app.get('/destroy', function (req, res) {
    db.posts.remove({}, {multi: true}, function (err, numRemoved) {
    });

    db.authors.remove({}, {multi: true}, function (err, numRemoved) {
    });

    res.send('Done!');
});

var response = {
    return: true,
    time: 0,
    result: null
};

/**
 * Seed categories
 */
app.get('/seedCategories', function (req, res) {
    var categories = [
        {
            name: 'Android'
        },
        {
            name: 'PHP'
        },
        {
            name: 'Java'
        },
        {
            name: 'dot Net'
        }
        ,
        {
            name: 'C/C++'
        }
        ,
        {
            name: 'iOS'
        }
        ,
        {
            name: 'Python'
        }
        ,
        {
            name: 'Ruby'
        }
    ];

    db.categories.count({}, function (err, count) {
        if (count > 0) {
            res.json('Seeded!');
        } else {
            db.categories.insert(categories, function (err, docs) {
                res.json(docs);
            });
        }
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

app.get('/test', function (req, res) {
    db.posts.insert({title: 'sdfjlksdf'}, (err, newDoc) => {
        console.log(err);
        console.log(newDoc);

        res.json(newDoc);
    })
});

/**
 * Get posts
 */
app.get('/posts', function (req, res) {
    var startTime = datek.getNowTimestamp();

    db.posts.find({}, function (err, posts) {
        var doneTime = datek.getNowTimestamp();
        var sumTime;
        sumTime = doneTime - startTime;
        response.time = sumTime;
        response.result = posts;

        res.json(response);
    });
});

app.get('/authors', (req, res) => {
    db.authors.find({}, (err, authors) => {
        res.json(authors);
    })
});

/**
 * Get author by username
 */
app.get('/author/:username', (req, res) => {
    var username = req.params.username;
    var startTime = datek.getNowTimestamp();

    db.authors.find({username: username}, (err, authors) => {
        var doneTime = datek.getNowTimestamp();
        var sumTime;
        sumTime = doneTime - startTime;
        response.time = sumTime;
        response.result = authors;

        res.json(response);
    });
});

/**
 * Get author by id
 */
app.get('/author_/:id', (req, res) => {
    var id = req.params.id;
    var startTime = datek.getNowTimestamp();

    db.authors.find({_id: id}, (err, authors) => {
        var doneTime = datek.getNowTimestamp();
        var sumTime;
        sumTime = doneTime - startTime;
        response.time = sumTime;
        response.result = authors;

        res.json(response);
    });
});

app.get('/lorem', (req, res) => {
    res.send(genK.generateContent());
});

/**
 * Server Listen
 */
http.listen(8001, () => {
    console.log('listening on localhost:8001');
});