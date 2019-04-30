let mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
  login: String,
  email: String,
  password: String,
	creationDate: {type: Date, default: Date.now},
  followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	followings: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}],
	recipes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}]
});

let FollowingSchema = new mongoose.Schema({
	food: {type: mongoose.Schema.Types.ObjectId, ref: 'Food'},
	type: String
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
