var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  login: String,
  email: String,
  password: String,
  follow: [{type: mongoose.Schema.Types.ObjectId, ref: 'Follow'}]
});

var FollowSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  item_id: mongoose.Types.ObjectId,
  addTime: Date
});

const User = mongoose.model('User', UserSchema);
const Follow = mongoose.model('Follow', FollowSchema);

module.exports = { User, Follow };
