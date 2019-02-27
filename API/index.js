var express = require('express');
var app = express();
var db = require('./db');

var UserController = require('./Models/user/UserController');
app.use('/users', UserController);

var server = app.listen(8080, function(){
  var port = server.address().port
  console.log("Listening on port " + port)
});

module.exports = app;
