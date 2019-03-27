var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  login: String,
  email: String,
  password: String,
	creationDate: Date,
  followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	followings: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}]
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
