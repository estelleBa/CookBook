var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

////////////////////////////////////////////////////////////////////////////////

var FollowModel = require('./Follow');
var UserModel = require('../user/User');

////////////////////////////////////////////////////////////////////////////////
// FOLLOWS
////////////////////////////////////////////////////////////////////////////////

router.route('/user')
// follow user
.post(function(req, res){
	const user_id = isLoggedIn(req);
	if(user_id){
		const item_id = mongoose.Types.ObjectId(req.body.id);

		UserModel.findOne({ _id : item_id}).exec(function(err, doc){
			if(err) res.status(500).json({res : 500});
			if(!doc) res.status(404).json({res : 404});
			else {

			}
		});
	}
	else res.status(401).json({res : 401});
});

////////////////////////////////////////////////////////////////////////////////

router.route('/unfollow')
// unfollow
.post(function(req, res){
	const user_id = isLoggedIn(req);
	if(user_id){
		const item_id = mongoose.Types.ObjectId(req.body.id);
		UserModel.User.findOne({ _id: user_id }).exec(function(err, doc){
			if(err) res.status(500).json({res : 500});
			else if(!doc) res.status(404).json({res : 404});
			else if(doc.follow.indexOf(item_id) != -1) {
				doc.follow.pull(item_id);
				doc.save();
				UserModel.Follow.deleteOne({ user : user_id, item_id : item_id }).exec();
			}
			res.status(200).json({res : 200});
		});
	}
	else res.status(401).json({res : 401});
});

////////////////////////////////////////////////////////////////////////////////

router.route('/followed')
// get followed
.get(function(req, res){
	const user_id = isLoggedIn(req);
	if(user_id){
		UserModel.User.findOne({ _id: user_id }).populate('follows').exec(function(err, doc){
			if(err) res.status(500).json({res : 500});
      else res.status(200).json({res : doc});
    });
	}
	else res.status(401).json({res : 401});
});

////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////
// 0 = not ok
// 1 = ok
// 2 = taken

function isLoggedIn(req){
  return req.session.user_id;
}

module.exports = router;
