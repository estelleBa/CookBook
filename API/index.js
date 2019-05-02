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
let CategoryController = require('./Models/category/CategoryController');
let BoardController = require('./Models/board/BoardController');

app.use('/users', UserController);
app.use('/recipes', RecipeController);
app.use('/categories', CategoryController);
app.use('/boards', BoardController);

let server = app.listen(8000, function(){
  let port = server.address().port
  console.log("Listening on port " + port)
});

module.exports = app;
