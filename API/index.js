var express = require('express');
var app = express();
var db = require('./db');
var session = require('express-session');
var cookieParser = require('cookie-parser');

express().use(cookieParser());
app.use(session({
  secret: "toto",
  resave: true,
  saveUninitialized: true
}));

var UserController = require('./Models/user/UserController');
var RecipeController = require('./Models/recipe/RecipeController');

app.use('/users', UserController);
app.use('/recipes', RecipeController);

var server = app.listen(8000, function(){
  var port = server.address().port
  console.log("Listening on port " + port)
});

module.exports = app;
