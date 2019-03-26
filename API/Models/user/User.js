var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  login: String,
  email: String,
  password: String,
	creationDate: Date,
  followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	followings: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

var FollowSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  item_id: mongoose.Types.ObjectId,
	item_type: String,
  addDate: Date
});

const User = mongoose.model('User', UserSchema);
const Follow = mongoose.model('Follow', FollowSchema);

module.exports = { User, Follow };
