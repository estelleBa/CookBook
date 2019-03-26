var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

////////////////////////////////////////////////////////////////////////////////

var bcrypt = require('bcrypt');

var UserModel = require('./User');

////////////////////////////////////////////////////////////////////////////////

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
	const user_id = isLoggedIn(req);
  if(!user_id){
		const body = req.body;
		if(body.login !== undefined && body.login !== '' &&
		body.email !== undefined && body.email !== ''&&
		body.password !== undefined && body.password !== '') {
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
		res.json({res : 0});
  }
  else res.status(401).json({res : 401});
});

////////////////////////////////////////////////////////////////////////////////

router.route('/find/:id')
// find user by id
.get(function(req, res){
	//
	req.session.user_id = mongoose.Types.ObjectId(req.params.id);
	//
  if(isLoggedIn(req)){
    var ObjectId = mongoose.Types.ObjectId(req.params.id);
    UserModel.User.findOne({ _id : ObjectId}).exec(function(err, doc){
			if(err) res.status(500).json({res : 500});
			else if(doc) res.status(200).json({user : doc});
			else res.status(404).json({res : 404});
    });
  }
  else res.status(401).json({res : 401});
});

////////////////////////////////////////////////////////////////////////////////

router.route('/update/:id')
// update user
.put(function(req, res){
	const user_id = isLoggedIn(req);
	const ObjectId = mongoose.Types.ObjectId(req.params.id);
  if(user_id==ObjectId){
		const body = req.body;
    UserModel.User.findOne({ _id : user_id}).exec(function(err, doc){
			if(err) res.status(500).json({res : 500});
			if(doc){
				var login = (body.login !== undefined && body.login !== '') ? body.login : doc.login;
				var email = (body.email !== undefined && body.email !== '') ? body.email : doc.email;
				UserModel.User.findOneAndUpdate({ _id : user_id}, {$set: {login: login, email: email}}).exec(function(err, doc){
					if(err) res.status(500).json({res : 500});
					else res.status(200).json({res : 200});
	      });
			}
			else res.status(404).json({res : 404});
    });
  }
  else res.status(401).json({res : 401});
});

////////////////////////////////////////////////////////////////////////////////

router.route('/checkLogin')
// check login
.post(function(req, res){
	const login = req.body.login;
	isLoginValid(isLoggedIn(req), login, function(validity){
		res.json({res : validity});
	});
});

////////////////////////////////////////////////////////////////////////////////

router.route('/checkMail')
// check email
.post(function(req, res){
	const email = req.body.email;
	isMailValid(isLoggedIn(req), email, function(validity){
		res.json({res : validity});
	});
});

////////////////////////////////////////////////////////////////////////////////
// 0 = not ok
// 1 = ok
// 2 = taken

function isLoggedIn(req){
  return req.session.user_id;
}

function isLoginValid(user_id, login, callback){
	var query = (user_id) ? UserModel.User.find({ _id: { $ne: user_id }, login: login }) : UserModel.User.find({ login: login });

  query.exec(function(err, doc){
    if(doc.length > 0) validity=2;
    else validity=1;
    callback(validity);
  });
}

function isMailValid(user_id, email, callback){
	var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(reg.test(email)){
		var query = (user_id) ? UserModel.User.find({ _id: { $ne: user_id }, email: email }) : UserModel.User.find({ email: email });

		query.exec(function(err, doc){
	    if(doc.length > 0) validity=2;
	    else validity=1;
	    callback(validity);
	  });
	}
	else callback(0);
}

function cryptPass(password){
  return bcrypt.hashSync(password, 10);
}

function comparePass(password, cryptedpass){
  return bcrypt.compareSync(password, cryptedpass);
}

module.exports = router;
