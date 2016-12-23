var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var storage = require('node-persist');
//var Q = require('Q');

var upload = multer(); // for parsing multipart/form-data
var app = express();

function init(){
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    storage.init()
    .then(setupRouting)
    .then(startListener)
    .catch(logError);
}
function setupRouting(){
    app.get('/', helloWorld);
    app.get('/users', getUsers);
    app.post('/bluetooth', upload.array(), saveBluetoothDection);

    return;
}
function startListener(){
    app.listen(3010, function(){
        console.log('app listening on pot 3010!');
    });

    return;
}

function helloWorld(req, res){
    res.send('Hello World');
}
function getUsers(req, res){
    res.json([{name: "test", mac: "123", room: "1", date: "2016-12-12"}]);
}
function saveBluetoothDection (req, res, next) {

    getRecord(req.body.mac)
    .then(function(record){return createUpdateRecord(record, req.body.mac);})
    .then(saveRecord)
    .then(function(){
        console.info('save success');
        res.send('save success');
    })
    .catch(function(err){console.error('save fail for', req.body.mac, err);});

}
function getRecord(mac){
    return storage.getItem(mac);
}
function createUpdateRecord(record, mac){
    if(!record){
        record = {};
    }
    record.mac = mac;
    record.time = new Date();
    
    return record;
}
function saveRecord(record){
    return storage.setItem(record.mac, record);
}

function logError(err){
    console.error(err);
}

function storageTest(){
    storage.setItem('mac', '1234').then(function(){
        return storage.getItem('name');
    })
    .then(function(value){
        console.log(value);
    });
}

init();