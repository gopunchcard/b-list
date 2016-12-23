var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.send('Hello World');
});

app.listen(3010, function(){
    console.log('app listening on pot 3010!');
});