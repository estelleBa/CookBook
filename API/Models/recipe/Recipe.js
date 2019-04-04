let mongoose = require('mongoose');

let RecipeSchema = new mongoose.Schema({
  title: String,
  image: String,
	quantity: Number,
	time: String,
	chef: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	ingredients: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient'}],
  steps: [{type: mongoose.Schema.Types.ObjectId, ref: 'Step'}],
  likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	grades: [{type: mongoose.Schema.Types.ObjectId, ref: 'Grade'}],
	creationDate: {type: Date, default: Date.now}
});

let FoodSchema = new mongoose.Schema({
	name: String
});

let IngredientSchema = new mongoose.Schema({
	food: {type: mongoose.Schema.Types.ObjectId, ref: 'Food'},
	quantity: Number,
	unity: String
});

let StepSchema = new mongoose.Schema({
  position: Number,
	content: String
});

let GradeSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	recipe: {type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'},
  grade: Number,
	comment: String,
  addDate: Date
});

const Recipe = mongoose.model('Recipe', RecipeSchema);
const Food = mongoose.model('Food', FoodSchema);
const Ingredient = mongoose.model('Ingredient', IngredientSchema);
const Step = mongoose.model('Step', StepSchema);
const Grade = mongoose.model('Grade', GradeSchema);

module.exports = { Recipe, Food, Ingredient, Step, Grade };
