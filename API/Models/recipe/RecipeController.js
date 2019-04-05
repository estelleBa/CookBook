let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
let bodyParser = require('body-parser');
let async = require('async');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

////////////////////////////////////////////////////////////////////////////////

let RecipeModel = require('./Recipe');

////////////////////////////////////////////////////////////////////////////////
// RECIPES
////////////////////////////////////////////////////////////////////////////////

router.route('/')
// get recipes
.get(function(req, res){
  RecipeModel.Recipe.find({}).exec(function(err, doc){
		if(err) res.status(500).json({res : err});
    else res.status(200).json({res : doc});
  });
});

////////////////////////////////////////////////////////////////////////////////

router.route('/create')
// create recipe
.post(function(req, res){
	const user_id = isLoggedIn(req);
  if(user_id){
		const body = req.body;
		if(body.title !== undefined && body.title !== '' &&
		body.quantity !== undefined && body.quantity !== '' &&
		body.ingredients !== undefined && body.ingredients.length > 0 &&
		body.steps !== undefined && body.steps.length > 0) {
			let newRecipe = new RecipeModel.Recipe({
				title: body.title,
				image: body.image,
				quantity: body.quantity,
				time: body.time,
				chef: user_id
			});
			newRecipe.save(function(err){
				if(err) res.status(500).json({res : err});
				else {
					let recipe_id = mongoose.Types.ObjectId(newRecipe._id);

					const insertFoods = async() => {
						for(const ingredient of body.ingredients){
							await insertFood(ingredient, recipe_id);
						}
					}
					insertFoods().then(() => {
						const insertSteps = async() => {
							for(const step of body.steps){
								await insertStep(step, recipe_id);
							}
						}
						insertSteps().then(() => {
							console.log('step inserted')
						});
					});
				}
			});
		}
		else res.json({res : 0});
	}
	else res.status(401).json({res : 401});
});

////////////////////////////////////////////////////////////////////////////////
// 0 = not ok
// 1 = ok
// 2 = taken

function isLoggedIn(req){
  return req.session.user_id;
}

function insertFood(food, recipe_id){
	RecipeModel.Food.findOne({ name : food.name }).exec(function(err, doc){
		if(err) res.status(500).json({res : err});
		else if(!doc){
			let newFood = new RecipeModel.Food({
				name: food.name
			});
			newFood.save(function(err){
				if(err) res.status(500).json({res : err});
				else insertIngredient(food, newFood._id, recipe_id);
			});
		}
		else insertIngredient(food, doc._id, recipe_id);
  });
}

function insertIngredient(ingredient, ingredient_id, recipe_id){
	let ObjectId = mongoose.Types.ObjectId(ingredient_id);
	let newIngredient = new RecipeModel.Ingredient({
		food: ObjectId,
		quantity: ingredient.quantity,
		unity: ingredient.unity
	});
	newIngredient.save(function(err){
		if(err) res.status(500).json({res : err});
		else {
			RecipeModel.Recipe.updateOne(
				{ _id: recipe_id },
				{ $push: { ingredients: newIngredient._id } }
			).exec(function(err, doc){
				if(err) res.status(500).json({res : err});
				else return;
			});
		}
	});
}

function insertStep(step, recipe_id){
	let newStep = new RecipeModel.Step({
		position: step.position,
		content: step.content
	});
	newStep.save(function(err){
		if(err) res.status(500).json({res : err});
		else {
			RecipeModel.Recipe.updateOne(
				{ _id: recipe_id },
				{ $push: { steps: newStep._id } }
			).exec(function(err, doc){
				if(err) res.status(500).json({res : err});
				else return;
			});
		}
	});
}

module.exports = router;
