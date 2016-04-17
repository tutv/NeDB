var express = require('express');
var app = express();
var http = require('http').Server(app);
var Datastore = require('nedb');
var todosDB = new Datastore({filename: 'databases/todos.db', autoload: true});

/**
 * @type {Parsers}
 */
var bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

function Todo(title, content) {
    var t = {};
    t.title = title;
    t.content = content;
    t.status = -1;

    return t;
}

app.get('/all', function (req, res) {
    todosDB.find({}, function (err, todos) {
        res.json(todos);
    });
});

app.post('/insert', function (req, res) {
    var title = req.body.title;
    var content = req.body.content;
    var t = Todo(title, content);

    todosDB.insert(t, function (err, newTodo) {
        if (err) {
            res.json({
                return: false
            });
        } else {
            res.json({
                return: true,
                response: newTodo
            });
        }
    });
});

app.get('/delete/:id', function (req, res) {
    var id = req.params.id;

    todosDB.remove({_id: id}, {}, function (err, numRemoved) {
        if (numRemoved > 0) {
            res.json({
                return: true,
                count: numRemoved
            });
        } else {
            res.json({
                return: false
            });
        }
    });

});

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

/**
 * Server Listen
 */
http.listen(6789, function () {
    console.log('listening on localhost:6789');
});