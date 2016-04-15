var express = require('express');
var app = express();
var http = require('http').Server(app);
var datek = require('datek');
var db = require('./nedb');
var genK = require('./generate');
var result = require('./result');
var Response = result.Response;

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

app.get('/seedPost', function (req, res) {
    var author = {
        "name": "Tu Tran",
        "username": "max",
        "created_at": 1460519680473,
        "updated_at": 1460519680473,
        "_id": "bkTdNw48xbLlUmxu"
    };

    db.categories.find({}, function (err, categories) {
        var count_category = categories.length;

        var count = 0;
        for (var i = 0; i < 100000; i++) {
            var random_category_index = genK.random(0, count_category);
            var random_category = categories[random_category_index];

            var post = {
                title: genK.generateTitle(),
                content: genK.generateContent(),
                author: author,
                categories: random_category,
                created_at: datek.getNowTimestamp(),
                updated_at: datek.getNowTimestamp()
            };

            db.posts.insert(post, function (err, newPost) {
                count++;
                console.log(count);
            });
        }
    });

    res.send('Seeding!');
});

app.get('/test', function (req, res) {
    db.posts.insert({title: 'sdfjlksdf'}, function (err, newDoc) {
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

    db.posts.find({}).limit(10).exec(function (err, posts) {
        var doneTime = datek.getNowTimestamp();
        var sumTime;
        sumTime = doneTime - startTime;
        response.time = sumTime;
        response.result = posts;

        res.json(response);
    });
});

app.get('/authors', function (req, res) {
    db.authors.find({}, function (err, authors) {
        res.json(authors);
    })
});

/**
 * Get author by username
 */
app.get('/author/:username', function (req, res) {
    var username = req.params.username;
    var startTime = datek.getNowTimestamp();

    db.authors.find({username: username}, function (err, authors) {
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
app.get('/author_/:id', function (req, res) {
    var id = req.params.id;
    var startTime = datek.getNowTimestamp();

    db.authors.find({_id: id}, function (err, authors) {
        var doneTime = datek.getNowTimestamp();
        var sumTime;
        sumTime = doneTime - startTime;
        response.time = sumTime;
        response.result = authors;

        res.json(response);
    });
});

app.get('/authorPosts/:id', function (req, res) {
    var id = req.params.id;
    db.posts.find({
        'author._id': id
    }, function (err, docs) {
        res.json(docs);
    })
});

/**
 * Count posts
 */
app.get('/countPosts', function (req, res) {
    var startTime = datek.getNowTimestamp();

    db.posts.count({}, function (err, count) {
        var stopTime = datek.getNowTimestamp();
        var sumTime = stopTime - startTime;
        var response = new Response(true, sumTime, count, 'Success!');

        res.json(response);
    });
});

/**
 * Server Listen
 */
http.listen(2356, function () {
    console.log('listening on localhost:8001');
});