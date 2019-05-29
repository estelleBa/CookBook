let express = require('express');
let app = express();
let db = require('./db');
let session = require('express-session');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');

express().use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "toto",
  resave: true,
  saveUninitialized: true
}));

let UserController = require('./Models/user/UserController');
let RecipeController = require('./Models/recipe/RecipeController');
let CategoryController = require('./Models/category/CategoryController');
let BoardController = require('./Models/board/BoardController');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/users', UserController);
app.use('/recipes', RecipeController);
app.use('/categories', CategoryController);
app.use('/boards', BoardController);

let server = app.listen(8000, function(){
  let port = server.address().port
  console.log("Listening on port " + port)
});

module.exports = app;
