let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
let bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

////////////////////////////////////////////////////////////////////////////////

let bcrypt = require('bcrypt');

let UserModel = require('./User');
let RecipeModel = require('../recipe/Recipe');
let BoardModel = require('../board/Board');

////////////////////////////////////////////////////////////////////////////////
// USERS
////////////////////////////////////////////////////////////////////////////////

router.route('/')
// get users
.get(function(req, res){
	if(isLoggedIn(req)){
    UserModel.User.find({}).exec(function(err, doc){
			if(err) res.status(500).json({res : err});
      else res.status(200).json({res : doc});
    });
  }
  else res.status(401).json({res : 401});
});

////////////////////////////////////////////////////////////////////////////////

router.route('/create')
// create user
.post(function(req, res){
	isLoggedIn(req, function(user_id){
		if(!user_id){
			const body = req.body;
			if(body.login !== undefined && body.login !== '' &&
			body.email !== undefined && body.email !== ''&&
			body.password !== undefined && body.password !== '') {
				let pass = cryptPass(body.password)
				let newUser = new UserModel.User({
					login: body.login,
					email: body.email,
					password: pass
				});
				newUser.save(function(err){
					if(err) res.status(500).json({error : err});
					else res.status(200).json({doc : true});
				});
			}
			else res.json({doc : false});
	  }
  	else res.status(401).json({error : 401});
	});
});

////////////////////////////////////////////////////////////////////////////////

router.route('/search')
// search user
.post(function(req, res){
	const user_id = isLoggedIn(req);
	UserModel.User.find({ login : { $regex : req.body.text }, _id: { $ne: user_id } }).exec(function(err, doc){
		if(err) res.status(500).json({res : err});
    else res.status(200).json({res : doc});
  });
});

////////////////////////////////////////////////////////////////////////////////

router.route('/show/:id')
// show user
.get(function(req, res){
  UserModel.User.findOne({ _id : req.params.id })
	.populate({
			path: 'followers followings likes recipes'
	}).exec(function(err, doc){
		if(err) res.status(500).json({res : err});
    else res.status(200).json({res : doc});
  });
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
			if(err) res.status(500).json({res : err});
			if(!doc) res.status(404).json({res : 404});
			else {
				let login = (body.login !== undefined && body.login !== '') ? body.login : doc.login;
				let email = (body.email !== undefined && body.email !== '') ? body.email : doc.email;
				UserModel.User.findOneAndUpdate({ _id : user_id}, {$set: {login: login, email: email}}).exec(function(err, doc){
					if(err) res.status(500).json({res : err});
					else res.status(200).json({res : 200});
	      });
			}
    });
  }
  else res.status(401).json({res : 401});
});

////////////////////////////////////////////////////////////////////////////////

router.route('/delete/:id')
// delete user
.delete(function(req, res){
	const user_id = isLoggedIn(req);
	const ObjectId = mongoose.Types.ObjectId(req.params.id);
  if(user_id==ObjectId){
    UserModel.User.deleteOne({ _id : user_id }).exec(function(err, doc){
			if(err) res.status(500).json({res : err});
			else {
				req.session.destroy();
				UserModel.User.updateMany(
					{ },
					{ $pull: { followings: user_id, followers: user_id } }
				).exec(function(err, doc){
					if(err) res.status(500).json({res : err});
					else {
						res.status(200).json({res : 200});
					}
				});
			}
    });
  }
  else res.status(401).json({res : 401});
});

////////////////////////////////////////////////////////////////////////////////

router.route('/login')
// login user
.post(function(req, res){
	isLoggedIn(req, function(user_id){
		if(!user_id){
			const body = req.body;
			if(body.login !== undefined && body.login !== '' &&
			body.password !== undefined && body.password !== '') {
				UserModel.User.findOne({ login: body.login }).exec(function(err, doc){
					if(err) res.status(500).json({error : err});
					if(!doc) res.status(200).json({error : 'not found'});
					else if(doc){
						if(comparePass(body.password, doc.password)){
							req.session.user_id = mongoose.Types.ObjectId(doc._id);
							res.status(200).json({doc : doc});
						}
						else res.status(200).json({error : 'bad password'});
					}
				});
			}
			else res.status(200).json({error : false});
		}
		else res.status(401).json({error : 401});
	});
});

////////////////////////////////////////////////////////////////////////////////

router.route('/logout')
// logout user
.get(function(req, res){
	isLoggedIn(req, function(user_id){
		if(user_id){
    	req.session.destroy();
    	res.status(200).json({res : 200});
		}
		else res.status(401).json({res : 401});
  });
});

////////////////////////////////////////////////////////////////////////////////

router.route('/checkLogin')
// check login
.post(function(req, res){
	const user_id = mongoose.Types.ObjectId(req.query.id);
	const login = req.body.login;
	isLoginValid(user_id, login, function(validity){
		res.json({doc : validity});
	});
});

////////////////////////////////////////////////////////////////////////////////

router.route('/checkMail')
// check email
.post(function(req, res){
	const user_id = mongoose.Types.ObjectId(req.query.id);
	const email = req.body.email;
	isMailValid(user_id, email, function(validity){
		res.json({doc : validity});
	});
});

////////////////////////////////////////////////////////////////////////////////
// USERS FOLLOWS
////////////////////////////////////////////////////////////////////////////////

router.route('/follow')
// follow
.post(function(req, res){
	const user_id = isLoggedIn(req);
	if(user_id){
		const item_id = mongoose.Types.ObjectId(req.body.id);
		const item_type = req.body.type;
		switch(item_type){
			case 'u':
				UserModel.User.findOne({ _id : user_id , followings : item_id }).exec(function(err, doc){
					if(err) res.status(500).json({res : err});
					else if(!doc){
						UserModel.User.updateOne(
							{ _id: user_id },
							{ $push: { followings: item_id } }
						).exec(function(err, doc){
							if(err) res.status(500).json({res : err});
							else {
								UserModel.User.updateOne(
									{ _id: item_id },
									{ $push: { followers: user_id } }
								).exec(function(err, doc){
									if(err) res.status(500).json({res : err});
									else {
										res.status(200).json({res : 1});
									}
								});
							}
						});
					}
					else {
						UserModel.User.updateOne(
							{ _id: user_id },
							{ $pull: { followings: item_id } }
						).exec(function(err, doc){
							if(err) res.status(500).json({res : err});
							else {
								UserModel.User.updateOne(
									{ _id: item_id },
									{ $pull: { followers: user_id } }
								).exec(function(err, doc){
									if(err) res.status(500).json({res : err});
									else {
										res.status(200).json({res : 0});
									}
								});
							}
						});
					}
				});
				break;
			case 'b':
				UserModel.User.findOne({ _id : user_id , followingsBoards : item_id }).exec(function(err, doc){
					if(err) res.status(500).json({res : err});
					else if(!doc){
						UserModel.User.updateOne(
							{ _id: user_id },
							{ $push: { followingsBoards: item_id } }
						).exec(function(err, doc){
							if(err) res.status(500).json({res : err});
							else {
								BoardModel.Board.updateOne(
									{ _id: item_id },
									{ $push: { followers: user_id } }
								).exec(function(err, doc){
									if(err) res.status(500).json({res : err});
									else {
										res.status(200).json({res : 1});
									}
								});
							}
						});
					}
					else {
						UserModel.User.updateOne(
							{ _id: user_id },
							{ $pull: { followingsBoards: item_id } }
						).exec(function(err, doc){
							if(err) res.status(500).json({res : err});
							else {
								BoardModel.Board.updateOne(
									{ _id: item_id },
									{ $pull: { followers: user_id } }
								).exec(function(err, doc){
									if(err) res.status(500).json({res : err});
									else {
										res.status(200).json({res : 0});
									}
								});
							}
						});
					}
				});
				break;
			case '#':
				UserModel.User.findOne({ _id : user_id , followingsTags : item_id }).exec(function(err, doc){
					if(err) res.status(500).json({res : err});
					else if(!doc){
						UserModel.User.updateOne(
							{ _id: user_id },
							{ $push: { followingsTags: item_id } }
						).exec(function(err, doc){
							if(err) res.status(500).json({res : err});
							else {
								RecipeModel.Hashtag.updateOne(
									{ _id: item_id },
									{ $push: { followers: user_id } }
								).exec(function(err, doc){
									if(err) res.status(500).json({res : err});
									else {
										res.status(200).json({res : 1});
									}
								});
							}
						});
					}
					else {
						UserModel.User.updateOne(
							{ _id: user_id },
							{ $pull: { followingsTags: item_id } }
						).exec(function(err, doc){
							if(err) res.status(500).json({res : err});
							else {
								RecipeModel.Hashtag.updateOne(
									{ _id: item_id },
									{ $pull: { followers: user_id } }
								).exec(function(err, doc){
									if(err) res.status(500).json({res : err});
									else {
										res.status(200).json({res : 0});
									}
								});
							}
						});
					}
				});
				break;
		}
	}
	else res.status(401).json({res : 401});
});

////////////////////////////////////////////////////////////////////////////////

router.route('/following')
// get followings
.get(function(req, res){
	const user_id = isLoggedIn(req);
	if(user_id){
		UserModel.User.findOne({ _id: user_id }).populate('followings').exec(function(err, doc){
			if(err) res.status(500).json({res : err});
      else res.status(200).json({res : doc});
    });
	}
	else res.status(401).json({res : 401});
});

////////////////////////////////////////////////////////////////////////////////

router.route('/followers')
// get followers
.get(function(req, res){
	const user_id = isLoggedIn(req);
	if(user_id){
		UserModel.User.findOne({ _id: user_id }).populate('followers').exec(function(err, doc){
			if(err) res.status(500).json({res : err});
      else res.status(200).json({res : doc});
    });
	}
	else res.status(401).json({res : 401});
});

////////////////////////////////////////////////////////////////////////////////
// 0 = not ok
// 1 = ok
// 2 = taken

function isLoggedIn(req, callback){
	if(req.query.id===undefined) callback(false);
	else {
		const user_id = mongoose.Types.ObjectId(req.query.id);
		UserModel.User.findOne({ _id : user_id }).exec(function(err, doc){
			if(err) callback(false);
			else if(doc) callback(doc._id);
			else callback(false);
		});
	}
  // return true;
}

function isLoginValid(user_id, login, callback){
	let query = (user_id) ? UserModel.User.find({ _id: { $ne: user_id }, login: login }) : UserModel.User.find({ login: login });

  query.exec(function(err, doc){
    if(doc.length > 0) callback(false);
    else callback(true);
  });
}

function isMailValid(user_id, email, callback){
	let reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(reg.test(email)){
		let query = (user_id) ? UserModel.User.find({ _id: { $ne: user_id }, email: email }) : UserModel.User.find({ email: email });

		query.exec(function(err, doc){
	    if(doc.length > 0) callback(false);
	    else callback(true);
	  });
	}
	else callback(false);
}

function cryptPass(password){
  return bcrypt.hashSync(password, 10);
}

function comparePass(password, cryptedpass){
  return bcrypt.compareSync(password, cryptedpass);
}

module.exports = router;
