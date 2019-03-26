var mongoose = require('mongoose');

var UserFollowSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  addDate: Date
});

var BoardFollowSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board'
  }],
  addDate: Date
});

var HashtagFollowSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hashtag'
  }],
  addDate: Date
});

const UserFollow = mongoose.model('UserFollow', UserFollowSchema);
const BoardFollow = mongoose.model('BoardFollow', BoardFollowSchema);
const HashtagFollow = mongoose.model('HashtagFollow', HashtagFollowSchema);

module.exports = { UserFollow, BoardFollow, HashtagFollow };
