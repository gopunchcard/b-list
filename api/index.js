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
    app.delete('/user', upload.array(), deleteUser);

    app.post('/bluetooth', upload.array(), saveBluetoothDection);
    app.get('/bluetooth/macAddresses', getAllMacs);

    return;
}
function startListener(){
    app.listen(3010, function(){
        console.log('app listening on port 3010!');
    });

    return;
}

function helloWorld(req, res){
    res.send('Hello World');
}

function getUsers(req, res){
    logRequest(req, 'getUsers');
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
        logRequest(req, 'saveBluetoothDetection');
        res.send('save success');
    })
    .catch(function(err){logError(req, 'save fail for ' + req.body.mac, err);});

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
        logRequest(req, 'saveUser');
        res.send('save success');
    })
    .catch(function(err){logError(req, 'save fail for ' + req.body.mac, err);});
}
function createUpdateRecord(record, incoming){
    if(!record){
        record = {};
    }
    _.extend(record, incoming);
    
    return record;
}

function deleteUser(req, res, next){
    getRecord(req.body.mac)
    .then(function(record){ 
        if(record){
            return deleteRecord(record.mac);
        }
        else{
            throw new Error('record does not exist');
        }
    })
    .then(function(){
        logRequest(req, 'deleteUser');
        res.send('delete success');
    })
    .catch(function(err){
        logError(req, 'delete failed for ' + req.body.mac, err);
        res.status(500).send({error: 'delete failed for ' + req.body.mac});
    });    
}
function deleteRecord(mac){
    return storage.removeItem(mac);
}

function logRequest(req, functionName){
    console.info(new Date(), req.ip, functionName);
}

function logError(req, msg, err){
    req = req || {ip:'unknown'};
    console.error(new Date(), req.ip, msg, err);
}



init();