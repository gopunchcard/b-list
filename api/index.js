var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function(req, res){
    res.send('Hello World');
});

app.post('/bluetooth', upload.array(), function (req, res, next) {
    console.log(req.body);
    res.json(req.body);
});

app.listen(3010, function(){
    console.log('app listening on pot 3010!');
});