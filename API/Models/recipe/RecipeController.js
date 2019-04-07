let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
let bodyParser = require('body-parser');
let async = require('async');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

////////////////////////////////////////////////////////////////////////////////

let RecipeModel = require('./Recipe');
let UserModel = require('../user/User');
let CategoryModel = require('../category/Category');
let BoardModel = require('../board/Board');

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
		body.steps !== undefined && body.steps.length > 0 &&
    body.categories !== undefined && body.categories.length > 0) {
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
              const addCategories = async() => {
  							for(const category of body.categories){
  								await addCategory(category, recipe_id);
  							}
  						}
              addCategories().then(() => {
                if(body.labels !== undefined && body.labels.length > 0) {
                  const addLabels = async() => {
      							for(const label of body.labels){
      								await addLabel(label, recipe_id);
      							}
      						}
                  addLabels();
                }
                if(body.hashtags !== undefined && body.hashtags.length > 0) {
                  const addHashtags = async() => {
      							for(const hashtag of body.hashtags){
      								await createHashtag(hashtag, recipe_id);
      							}
      						}
                  addHashtags();
                }
  							UserModel.User.updateOne(
  								{ _id: user_id },
  								{ $push: { recipes: recipe_id } }
  							).exec(function(err, doc){
  								if(err) res.status(500).json({res : err});
  								else {
                    if(body.board !== undefined && body.board !== '') {
        							addToBoard(body.board, recipe_id);
                    }
                    res.status(200).json({res : 200});
                  }
  							});
              });
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

router.route('/delete/:id')
// delete recipe
.get (function(req, res){
  const user_id = isLoggedIn(req);
  if(user_id){
    const ObjectId = mongoose.Types.ObjectId(req.params.id);
    RecipeModel.Recipe.findOne({ _id : ObjectId, chef : user_id }).exec(function(err, doc){
      if(err) res.status(500).json({res : err});
      else if(!doc){
        res.status(404).json({res : 404});
      }
      else {
        const rmIngredients = async() => {
          for(const ingredient of doc.ingredients){
            await rmIngredient(ingredient._id);
          }
        }
        rmIngredients().then(() => {
          const rmSteps = async() => {
            for(const step of doc.steps){
              await rmStep(step._id);
            }
          }
          rmSteps().then(() => {
            const rmGrades = async() => {
              for(const grade of doc.grades){
                await rmGrade(grade._id);
              }
            }
            rmGrades().then(() => {
              RecipeModel.Recipe.deleteOne({ _id : ObjectId }).exec(function(err, doc){
                if(err) res.status(500).json({res : err});
                else {
                  UserModel.User.updateMany(
                    { },
                    { $pull: { likes: ObjectId, recipes: ObjectId } }
                  ).exec(function(err, doc){
                    if(err) res.status(500).json({res : err});
                    else {
                      CategoryModel.Category.updateMany(
                        { },
                        { $pull: { recipes: ObjectId } }
                      ).exec(function(err, doc){
                        if(err) res.status(500).json({res : err});
                        else {
                          BoardModel.Board.updateMany(
                            { },
                            { $pull: { recipes: ObjectId } }
                          ).exec(function(err, doc){
                            if(err) res.status(500).json({res : err});
                            else {
                              res.status(200).json({res : 200});
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            });
          });
        });
      }
    });
  }
});

////////////////////////////////////////////////////////////////////////////////

router.route('/show/:id')
// show recipe
.get(function(req, res){
  RecipeModel.Recipe.findOne({ _id : req.params.id })
	.populate({
			path: 'chef categories ingredients steps likes grades labels hashtags boards',
			populate: {
				path: 'food'
			}
	}).exec(function(err, doc){
		if(err) res.status(500).json({res : err});
    else res.status(200).json({res : doc});
  });
});

////////////////////////////////////////////////////////////////////////////////

router.route('/search/:text')
// search recipes
.get(function(req, res){
	RecipeModel.Recipe.find({ title : { $regex : req.params.text }}).exec(function(err, doc){
		if(err) res.status(500).json({res : err});
    else res.status(200).json({res : doc});
  });
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

function addCategory(category, recipe_id){
  let ObjectId = mongoose.Types.ObjectId(category.id);
  CategoryModel.Category.updateOne(
    { _id: ObjectId },
    { $push: { recipes: recipe_id } }
  ).exec(function(err, doc){
    if(err) res.status(500).json({res : err});
    else {
      RecipeModel.Recipe.updateOne(
        { _id: recipe_id },
        { $push: { categories: ObjectId } }
      ).exec(function(err, doc){
        if(err) res.status(500).json({res : err});
        else return;
      });
    }
  });
}

function addLabel(label, recipe_id){
  let ObjectId = mongoose.Types.ObjectId(label.id);
  RecipeModel.Recipe.updateOne(
    { _id: recipe_id },
    { $push: { labels: ObjectId } }
  ).exec(function(err, doc){
    if(err) res.status(500).json({res : err});
    else return;
  });
}

function createHashtag(hashtag, recipe_id){
  RecipeModel.Hashtag.findOne({ name : hashtag.name }).exec(function(err, doc){
		if(err) res.status(500).json({res : err});
		else if(!doc){
			let newHashtag = new RecipeModel.Hashtag({
				name: hashtag.name
			});
			newHashtag.save(function(err){
				if(err) res.status(500).json({res : err});
				else addHashtag(newHashtag._id, recipe_id);
			});
		}
		else addHashtag(doc._id, recipe_id);
  });
}

function addHashtag(hashtag_id, recipe_id){
  let ObjectId = mongoose.Types.ObjectId(hashtag_id);
	RecipeModel.Recipe.updateOne(
		{ _id: recipe_id },
		{ $push: { hashtags: ObjectId } }
	).exec(function(err, doc){
		if(err) res.status(500).json({res : err});
		else return;
	});
}

function addToBoard(board, recipe_id){
  let ObjectId = mongoose.Types.ObjectId(board);
  BoardModel.Board.updateOne(
    { _id: ObjectId },
    { $push: { recipes: recipe_id } }
  ).exec(function(err, doc){
    if(err) res.status(500).json({res : err});
    else {
      RecipeModel.Recipe.updateOne(
        { _id: recipe_id },
        { $push: { boards: ObjectId } }
      ).exec(function(err, doc){
        if(err) res.status(500).json({res : err});
        else return;
      });
    }
  });
}

function rmIngredient(id){
  let ObjectId = mongoose.Types.ObjectId(id);
  RecipeModel.Ingredient.deleteOne({ _id : ObjectId }).exec(function(err, doc){
    if(err) res.status(500).json({res : err});
    else return;
  });
}

function rmStep(id){
  let ObjectId = mongoose.Types.ObjectId(id);
  RecipeModel.Step.deleteOne({ _id : ObjectId }).exec(function(err, doc){
    if(err) res.status(500).json({res : err});
    else return;
  });
}

function rmGrade(id){
  let ObjectId = mongoose.Types.ObjectId(id);
  RecipeModel.Grade.deleteOne({ _id : ObjectId }).exec(function(err, doc){
    if(err) res.status(500).json({res : err});
    else return;
  });
}

module.exports = router;
