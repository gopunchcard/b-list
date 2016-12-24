var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var storage = require('node-persist');
var _ = require('lodash');

var upload = multer(); // for parsing multipart/form-data
var app = express();

function init(){
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
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
    app.post('/user', upload.array(), saveUser);

    app.post('/bluetooth', upload.array(), saveBluetoothDection);
    app.get('/bluetooth/macAddresses', getAllMacs);

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
    console.log('fetch');
    res.json(storage.values());
}
function getAllMacs(req, res){
    var macsOnly = _.map(storage.values(), 'mac');
    res.json(macsOnly);
}

function saveBluetoothDection (req, res, next) {

    getRecord(req.body.mac)
    .then(function(record){return createUpdateRecordDetection(record, req.body.mac);})
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
function createUpdateRecordDetection(record, mac){
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

function saveUser(req, res, next){
    getRecord(req.body.mac)
    .then(function(record){return createUpdateRecord(record, req.body);})
    .then(saveRecord)
    .then(function(){
        console.info('save success');
        res.send('save success');
    })
    .catch(function(err){console.error('save fail for', req.body.mac, err);});
}
function createUpdateRecord(record, incoming){
    if(!record){
        record = {};
    }
    _.extend(record, incoming);
    
    return record;
}

function logError(err){
    console.error(err);
}



init();