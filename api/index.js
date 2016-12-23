var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var storage = require('node-persist');

function init(){
    var upload = multer(); // for parsing multipart/form-data
    var app = express();
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    storage.init()
    .then(setupRouting)
    .then(startListener);
}
function setupRouting(){
    app.get('/', helloWorld);

    app.get('/users', getUsers);

    app.post('/bluetooth', upload.array(), saveBluetoothDection);
}
function startListener(){
    app.listen(3010, function(){
        console.log('app listening on pot 3010!');
    });
}

function helloWorld(req, res){
    res.send('Hello World');
}
function getUsers(req, res){
    res.json([{name: "test", mac: "123", room: "1", date: "2016-12-12"}]);
}
function saveBluetoothDection (req, res, next) {
    console.log(req.body);
    res.json(req.body);

    storage.setItem('mac', req.body.mac)
}


init();