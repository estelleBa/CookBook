let express = require('express');
let app = express();
let db = require('./db');
let session = require('express-session');
let cookieParser = require('cookie-parser');

express().use(cookieParser());
app.use(session({
  secret: "toto",
  resave: true,
  saveUninitialized: true
}));

let UserController = require('./Models/user/UserController');
let RecipeController = require('./Models/recipe/RecipeController');

app.use('/users', UserController);
app.use('/recipes', RecipeController);

let server = app.listen(8000, function(){
  let port = server.address().port
  console.log("Listening on port " + port)
});

module.exports = app;
