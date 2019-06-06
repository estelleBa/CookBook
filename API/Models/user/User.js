let mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
  login: String,
  email: String,
  password: String,
	creationDate: {type: Date, default: Date.now},
  followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	followings: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	followingsBoards: [{type: mongoose.Schema.Types.ObjectId, ref: 'Board'}],
	followingsTags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Hashtag'}],
	likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}],
	recipes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}],
	boards: [{type: mongoose.Schema.Types.ObjectId, ref: 'Board'}],
	status: {type: Number, default: 0}
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
