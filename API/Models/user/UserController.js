var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

////////////////////////////////////////////////////////////////////////////////

var bcrypt = require('bcrypt');

////////////////////////////////////////////////////////////////////////////////

var UserModel = require('./User');

router.route('/')
// get users
.get(function(req, res){
	if(isLoggedIn(req)){
    UserModel.User.find({}).exec(function(err, doc){
      res.status(200).json({res : doc});
    });
  }
  else res.status(401).json({res : 401});
});

////////////////////////////////////////////////////////////////////////////////

router.route('/create')
// create user
.post(function(req, res){
  if(!isLoggedIn(req)){
    const body = req.body;
    if(body.login !== undefined && body.login !== '' &&
    body.email !== undefined && body.email !== ''&&
    body.password !== undefined && body.password !== '') {
      isLoginValid(body.login, function(valid){
        if(valid==true){
					if(isMailValid(body.email)){
	          var pass = cryptPass(body.password)
	          var newUser = new UserModel.User({
	            login: body.login,
	            email: body.email,
	            password: pass
	          });
	          newUser.save(function(err){
	            if(err) res.status(500).json({res : 500});
	            else res.status(200).json({res : 200});
	          });
					}
					else res.json({res : "invalid mail"});
        }
        else res.json({res : "login taken"});
      })
    }
    else res.json({res : "empty fields"});
  }
  else res.status(401).json({res : 401});
});

////////////////////////////////////////////////////////////////////////////////

router.route('/find/:id')
// find user by id
.get(function(req, res){
  if(isLoggedIn(req)){
    var ObjectId = mongoose.Types.ObjectId(req.params.id);
    UserModel.User.findOne({ _id : ObjectId}).exec(function(err, doc){
			if(doc) res.status(200).json({user : doc});
			else res.status(404).json({res : 404});
    });
  }
  else res.status(401).json({res : 401});
});

////////////////////////////////////////////////////////////////////////////////

router.route('/update/:id')
// update user
.put(function(req, res){
  if(isLoggedIn(req)){
		const body = req.body;
    var ObjectId = mongoose.Types.ObjectId(req.params.id);
    // login
    if(body.login !== undefined && body.login !== ''){
      isLoginValid(body.login, function(valid){
        if(valid==true){
          UserModel.User.findOneAndUpdate({ _id : ObjectId}, {$set: {login: body.login}}).exec(function(err, doc){
            if(err) res.status(500).json({res : 500});
          });
        }
        else res.json({res : "login taken"});
      })
    }
    // email
    if(body.email !== undefined && body.email !== ''){
			if(isMailValid(body.email)){
	      UserModel.User.findOneAndUpdate({ _id : ObjectId}, {$set: {email: body.email}}).exec(function(err, doc){
	        if(err) res.status(500).json({res : 500});
	      });
			}
			else res.json({res : "invalid mail"});
    }
    // password
    if(body.password !== undefined && body.password !== ''){
      var pass = cryptPass(body.password)
      UserModel.User.findOneAndUpdate({ _id : ObjectId}, {$set: {password: pass}}).exec(function(err, doc){
        if(err) res.status(500).json({res : 500});
      });
    }
  }
  else res.status(401).json({res : 401});
});

////////////////////////////////////////////////////////////////////////////////

function isLoggedIn(req){
  //return (req.session.user_id !== undefined ? true : false);
	return true;
}
function isLoginValid(login, callback){
  UserModel.User.find({ login: login }).exec(function(err, doc){
    if(doc.length > 0) valid=false;
    else valid=true;
    callback(valid);
  });
}
function isMailValid(email){
	var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(email);
}
function cryptPass(password){
  return bcrypt.hashSync(password, 10);
}
function comparePass(password, cryptedpass){
  return bcrypt.compareSync(password, cryptedpass);
}

module.exports = router;
