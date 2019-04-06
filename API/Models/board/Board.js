let mongoose = require('mongoose');

let BoardSchema = new mongoose.Schema({
	name: String,
  admin: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  recipes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}],
  followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

const Board = mongoose.model('Board', BoardSchema);

module.exports = { Board };
