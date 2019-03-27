var mongoose = require('mongoose');

var RecipeSchema = new mongoose.Schema({
  title: String,
  image: String,
	quantity: Number,
	time: String,
	chef: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	ingredients: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ingredients'}],
  steps: [{type: mongoose.Schema.Types.ObjectId, ref: 'Step'}],
  likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	grade: {type: mongoose.Schema.Types.ObjectId, ref: 'Grade'},
	creationDate: Date
});

var IngredientSchema = new mongoose.Schema({
	name: String,
	quantity: Number,
	unity: String
});

var StepSchema = new mongoose.Schema({
  position: Number,
	content: String
});

var GradeSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	recipe: {type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'},
  grade: Number,
  addDate: Date
});

const Recipe = mongoose.model('Recipe', RecipeSchema);
const Ingredient = mongoose.model('Ingredient', IngredientSchema);
const Step = mongoose.model('Step', StepSchema);
const Grade = mongoose.model('Grade', GradeSchema);

module.exports = { Recipe, Ingredient, Step, Grade };
