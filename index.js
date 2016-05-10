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
            name: 'dotNet'
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

app.get('/seedPosts/:count', function (req, res) {
    var author = {
        "name": "Tu Tran",
        "username": "max",
        "created_at": 1460519680473,
        "updated_at": 1460519680473,
        "_id": "bkTdNw48xbLlUmxu"
    };

    var countSeed = parseInt(req.params.count);

    db.categories.find({}, function (err, categories) {
        var count_category = categories.length;

        var count = 0;
        for (var i = 0; i < countSeed; i++) {
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

/**
 * Get posts
 */
app.get('/posts', function (req, res) {
    var startTime = datek.getNowTimestamp();
    console.log(req.route.path);

    db.posts.find({}).limit(10).exec(function (err, posts) {
        var doneTime = datek.getNowTimestamp();
        var sumTime;
        sumTime = doneTime - startTime;
        response.time = sumTime;
        response.result = posts;

        res.json(response);
    });
});

/**
 * Paging posts
 */
app.get('/posts/:page', function (req, res) {
    console.log(req.route.path);

    var page = parseInt(req.params.page);
    var startTime = datek.getNowTimestamp();
    var offset = (page - 1) * 10;

    db.posts.find({}).skip(offset).limit(10).exec(function (err, posts) {
        var doneTime = datek.getNowTimestamp();
        var sumTime;
        sumTime = doneTime - startTime;
        response.time = sumTime;
        response.result = posts;

        res.json(response);
    });
});

/**
 * Get post by id_
 */
app.get('/post/:id', function (req, res) {
    console.log(req.route.path);

    var id = req.params.id;
    var startTime = datek.getNowTimestamp();

    db.posts.find({_id: id}, function (err, posts) {
        var stopTime = datek.getNowTimestamp();
        var sumTime = stopTime - startTime;
        var response;

        if (err) {
            response = new Response(false, sumTime, null, 'Error!');
            res.json(response);

            throw err;
        }

        if (posts.length == 0) {
            response = new Response(false, sumTime, null, 'Post not found!');
        } else {
            response = new Response(true, sumTime, posts[0], 'Success!');
        }

        res.json(response);
    })
});

app.get('/authors', function (req, res) {
    console.log(req.route.path);

    db.authors.find({}, function (err, authors) {
        res.json(authors);
    })
});

/**
 * Get author by username
 */
app.get('/author/:username', function (req, res) {
    console.log(req.route.path);

    var username = req.params.username;
    var startTime = datek.getNowTimestamp();

    db.posts.find({
        'author.username': username
    }).limit(10).exec(function (err, posts) {
        var doneTime = datek.getNowTimestamp();
        var sumTime;
        sumTime = doneTime - startTime;
        response.time = sumTime;
        response.result = posts;

        res.json(response);
    });
});

/**
 * Get author by id
 */
app.get('/author_/:id', function (req, res) {
    console.log(req.route.path);

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
    console.log(req.route.path);

    var id = req.params.id;
    db.posts.find({
        'author._id': id
    }, function (err, docs) {
        res.json(docs);
    })
});

app.get('/update', function (req, res) {
    var catUpdate = {
        "name": "Ruby",
        "_id": "kEig33Tn5hLxirpC"
    };

    var startTime = datek.getNowTimestamp();

    db.posts.update({'categories.name': 'Java'}, {$set: {categories: catUpdate}}, {multi: true}, function (err, numReplaced) {
        var doneTime = datek.getNowTimestamp();
        var sumTime;
        sumTime = doneTime - startTime;
        response.time = sumTime;
        response.result = numReplaced;

        res.json(response);
    });
});

app.get('/delete', function (req, res) {
    var startTime = datek.getNowTimestamp();
    db.posts.remove({'categories.name': 'Python'}, {multi: true}, function (err, numDeleted) {
        var doneTime = datek.getNowTimestamp();
        var sumTime;
        sumTime = doneTime - startTime;
        response.time = sumTime;
        response.result = numDeleted;

        res.json(response);
    });
});

app.get('/delete/:id', function (req, res) {
    var id = req.params.id;
    var startTime = datek.getNowTimestamp();
    db.posts.remove({_id: id}, {}, function (err, numDeleted) {
        var doneTime = datek.getNowTimestamp();
        var sumTime;
        sumTime = doneTime - startTime;
        response.time = sumTime;
        response.result = numDeleted;

        res.json(response);
    });
});

/**
 * Count posts
 */
app.get('/countPosts', function (req, res) {
    console.log(req.route.path);

    var startTime = datek.getNowTimestamp();

    db.posts.count({}, function (err, count) {
        var stopTime = datek.getNowTimestamp();
        var sumTime = stopTime - startTime;
        var response = new Response(true, sumTime, count, 'Success!');

        res.json(response);
    });
});

app.get('/api/1', function(req, res) {
    var startTime = datek.getNowTimestamp();

    db.posts.count({}, function (err, count) {
        var stopTime = datek.getNowTimestamp();
        var sumTime = stopTime - startTime;
        var response = new Response(true, sumTime, count, 'Success!');

        res.json(response);
    });
});

app.get('/api/2', function(req, res) {

});

app.get('/api/3', function(req, res) {

});

app.get('/api/4', function(req, res) {

});

app.get('/api/5', function(req, res) {

});

app.get('/api/6', function(req, res) {

});

/**
 * Server Listen
 */
http.listen(2356, function () {
    console.log('listening on localhost:2356');
});