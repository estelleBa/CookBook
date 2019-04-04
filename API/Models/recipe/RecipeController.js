let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
let bodyParser = require('body-parser');

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
				time: body.time
			});
			newRecipe.save(function(err){
				if(err) res.status(500).json({res : err});
				else {
					let recipe_id = mongoose.Types.ObjectId(newRecipe._id);

					const insertFoods = async() => {
						for(let ingredient of body.ingredients){
							await insertFood(ingredient);
						}
					}
					insertFoods().then(() => {
						const insertIngredients = async() => {
							for(let ingredient of body.ingredients){
								await insertIngredient(ingredient, recipe_id);
							}
						}
						insertIngredients().then(() => {
						  console.log('done');
						})
					})
				}

				// 	insertFood(body.ingredients, async() => {
				// 		insertIngredient(body.ingredients, async(ingredient_ids) => {
				// 			console.log(ingredient_ids)
				// 		});
				// 	});
				// }
			});

			// 			body.ingredients.forEach(function(food){
			// 				RecipeModel.Food.findOne({ name : food.name }).exec(function(err, doc){
			// 					if(err) res.status(500).json({res : err});
			// 					else if(doc){
			// 						let food_id = mongoose.Types.ObjectId(doc._id);
			// 						insertIngredient(food_id, food.quantity, food.unity, function(){
			//
			// 						});
			// 					}
			// 			  });
			//
			// 			getFoodId(body.ingredients, function(food_ids){
			// 				//console.log(ingredients_ids)
			// 				food_ids.forEach(function(id){
			// 					let ObjectId = mongoose.Types.ObjectId(id);
			// 					RecipeModel.Food.findOne({ _id : ObjectId }).exec(function(err, doc){
			// 						//console.log(doc)
			// 						if(err) res.status(500).json({res : err});
			// 						else if(!doc) res.status(404).json({res : 404});
			// 						else {
			// 							RecipeModel.User.updateOne(
			// 								{ _id: item_id, followers: { $ne: user_id } },
			// 								{ $push: { followers: user_id } }
			// 							).exec(function(err, doc){
			// 								if(err) res.status(500).json({res : err});
			// 								else {
			// 									res.status(200).json({res : 200});
			// 								}
			// 							});
			// 						}
			// 					});
			// 				});
			// 				res.status(200).json({res : ingredients_ids});
			// 			});
			// 		});
			// 	}
			// });
			// let newIngredient = new RecipeModel.Recipe({
			// 	title: body.title,
			// 	image: body.image,
			// 	quantity: body.quantity,
			// 	time: body.time
			// });
			//res.status(200).json({res : newRecipe});

			// newUser.save(function(err){
			// 	if(err) res.status(500).json({res : err});
			// 	else res.status(200).json({res : 200});
			// });
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

function insertFood(ingredient){
	RecipeModel.Food.findOne({ name : ingredient.name }).exec(function(err, doc){
		if(err) res.status(500).json({res : err});
		else if(!doc){
			let newFood = new RecipeModel.Food({
				name: ingredient.name
			});
			newFood.save(function(err){
				if(err) res.status(500).json({res : err});
				console.log('new : '+ingredient.name);
			});
		}
		console.log('old : '+ingredient.name);
  });
	return;
}

function insertIngredient(ingredient, recipe_id){
	RecipeModel.Food.findOne({ name : ingredient.name }).exec(function(err, doc){
		if(err) res.status(500).json({res : err});
		else if(doc){
			let food_id = mongoose.Types.ObjectId(doc._id);
			let newIngredient = new RecipeModel.Ingredient({
				food: food_id,
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
					});
				}
			});
		}
  });
	return;
}

module.exports = router;
