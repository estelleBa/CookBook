let mongoose = require('mongoose');

let CategorySchema = new mongoose.Schema({
	name: String,
  color: String,
  recipes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}]
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = { Category };
