var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var User = require('./User');

router.route('/')
.get(function(req, res){
  res.json({message : "Read all user", methode : req.method});
})
.post(function(req, res){
  res.json({message : "Add user", methode : req.method});
});

router.route('/:id')
.get(function(req, res){
  res.json({message : "Read one user", methode : req.method});
})
.put(function(req, res){
  res.json({message : "Update user", methode : req.method});
})
.delete(function(req, res){
  res.json({message : "delete user", methode : req.method});
});

module.exports = router;
