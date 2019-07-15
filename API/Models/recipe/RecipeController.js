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
  isLoggedIn(req, function(user_id){
    if(user_id){
  		const body = req.body;
  		if(body.title !== undefined && body.title !== '' &&
  		body.quantity !== undefined && body.quantity !== '' &&
      body.time !== undefined && body.time !== '' &&
      body.recipe !== undefined && body.recipe !== '' &&
  		body.ingredients !== undefined && body.ingredients.length > 0 &&
      body.categories !== undefined && body.categories.length > 0) {
  			let newRecipe = new RecipeModel.Recipe({
  				title: body.title,
  				image: body.image,
  				quantity: body.quantity,
          time: body.time,
          recipe: body.recipe,
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
                    // if(body.board !== undefined && body.board !== '') {
        						// 	addToBoard(body.board, recipe_id);
                    // }
										// SELECT A BOARD AFTER RECIPE CREATION
                    res.status(200).json({res : 200});
                  }
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
});

////////////////////////////////////////////////////////////////////////////////

router.route('/delete/:id')
// delete recipe
.delete (function(req, res){
  isLoggedIn(req, function(user_id){
    if(user_id){
      const ObjectId = mongoose.Types.ObjectId(req.params.id);
      RecipeModel.Recipe.findOne({ _id : ObjectId, chef : user_id }).exec(function(err, doc){
        if(err) res.status(500).json({res : err});
        else if(!doc) res.status(404).json({res : 404});
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
    else res.status(401).json({res : 401});
  });
});

////////////////////////////////////////////////////////////////////////////////

router.route('/update/:id')
// update recipe
.put(function(req, res){
  isLoggedIn(req, function(user_id){
    if(user_id){
      const ObjectId = mongoose.Types.ObjectId(req.params.id);
      const body = req.body;
      RecipeModel.Recipe.findOne({ _id : ObjectId, chef : user_id }).exec(function(err, doc){
    		if(err) res.status(500).json({res : err});
        else if(!doc) res.status(404).json({res : 404});
        else {
  				let image = (body.image !== undefined && body.image !== '') ? body.image : doc.image;
          let oldCategories = doc.categories;
          let categories = doc.categories;
          if(body.categories !== undefined){
            categories = [];
            for(const category of body.categories){
              const ObjectId = mongoose.Types.ObjectId(category.id);
              categories.push(ObjectId)
            }
          }
  				RecipeModel.Recipe.findOneAndUpdate({ _id : ObjectId, chef : user_id }, {$set: { image: image, categories: categories }}).exec(function(err, doc){
  					if(err) res.status(500).json({res : err});
  					else {
              if(body.categories !== undefined){
                const addRecipeToCategories = async() => {
                  for(const category of body.categories){
                    await addRecipeToCategory(category.id, ObjectId);
                  }
                }
                addRecipeToCategories().then(() => {
                  const rmOldRecipeCategories = async() => {
                    for(const category of oldCategories){
                      await rmOldRecipeCategory(category._id, ObjectId);
                    }
                  }
                  rmOldRecipeCategories().then(() => {
                    res.status(200).json({res : 200});
                  });
                });
              }
              else res.status(200).json({res : 200});
            }
  	      });
        }
      });
    }
    else res.status(401).json({res : 401});
  });
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

router.route('/research')
// show recipes with params [ TURN BUTTON OFF IF NO PARAMETERS ]
.post(function(req, res){
  const body = req.body;
  let labels = [];
  let hashtags = [];

  if(body.labels !== undefined && body.labels.length > 0) {
    for(let i=0; i<body.labels.length; i++){
      labels.push({ labels : mongoose.Types.ObjectId(body.labels[i].id) });
    }
  }
  if(body.hashtags !== undefined && body.hashtags.length > 0) {
    for(let i=0; i<body.hashtags.length; i++){
      hashtags.push({ hashtags : mongoose.Types.ObjectId(body.hashtags[i].id) });
    }
  }
  let toto = 1;
  console.log(toto == 0 && ('works'))
  // (body.categories !== undefined && body.categories !== '') ? { categories : mongoose.Types.ObjectId(body.categories) } : { $ne : { categories : 0 } } ,
  // (body.labels !== undefined && body.labels.length > 0) ? (body.labels.length > 1) ? { $and: labels } : { labels : mongoose.Types.ObjectId(body.labels[0].id) } : { $ne : { labels : 0 } } ,
  // (body.hashtags !== undefined && body.hashtags.length > 0) ? (body.hashtags.length > 1) ? { $and: hashtags } : { hashtags : mongoose.Types.ObjectId(body.hashtags[0].id) } : { $ne : { hashtags : 0 } }
  RecipeModel.Recipe.find(
    (body.categories !== undefined && body.categories !== '') ? { categories : mongoose.Types.ObjectId(body.categories) } : { categories : { $ne : mongoose.Types.ObjectId(0) } } ,
    (body.labels !== undefined && body.labels.length > 0) ? (body.labels.length > 1) ? { $and: labels } : { labels : mongoose.Types.ObjectId(body.labels[0].id) } : { labels : { $ne : mongoose.Types.ObjectId(0) } } ,
    (body.hashtags !== undefined && body.hashtags.length > 0) ? (body.hashtags.length > 1) ? { $and: hashtags } : { hashtags : mongoose.Types.ObjectId(body.hashtags[0].id) } : { hashtags : { $ne : mongoose.Types.ObjectId(0) } }
  ).exec(function(err, doc){
    if(err) res.status(500).json({res : err});
    else {
      let recipes = [];
      for(let i = 0; i<doc.length; i++){
        recipes.push({ _id : mongoose.Types.ObjectId(doc[i]._id) });
      }
      console.log(recipes)
      RecipeModel.Recipe.find({ $or : [{ _id : recipes }] }).exec(function(err, doc){
        res.status(200).json({res : doc});
      });
    }
  });
});

////////////////////////////////////////////////////////////////////////////////

router.route('/search')
// search recipes
.post(function(req, res){
	RecipeModel.Recipe.find({ title : { $regex : req.body.text }}).exec(function(err, doc){
		if(err) res.status(500).json({res : err});
    else res.status(200).json({res : doc});
  });
});

////////////////////////////////////////////////////////////////////////////////

router.route('/like')
// like recipes
.post(function(req, res){
  isLoggedIn(req, function(user_id){
    if(user_id){
      const ObjectId = mongoose.Types.ObjectId(req.body.id);
  		RecipeModel.Recipe.findOne({ _id : ObjectId , likes : user_id }).exec(function(err, doc){
  			if(err) res.status(500).json({res : err});
  			else if(!doc){
  				RecipeModel.Recipe.updateOne({ _id : ObjectId }, { $push: { likes: user_id } }).exec(function(err, doc){
  					if(err) res.status(500).json({res : err});
  			    else res.status(200).json({res : 1});
  			  });
  			}
  			else {
  				RecipeModel.Recipe.updateOne({ _id : ObjectId }, { $pull: { likes: user_id } }).exec(function(err, doc){
  					if(err) res.status(500).json({res : err});
  			    else res.status(200).json({res : 0});
  			  });
  			}
  		});
  	}
  	else res.status(401).json({res : 401});
  });
});

////////////////////////////////////////////////////////////////////////////////

router.route('/note')
// note recipes
.post(function(req, res){
  isLoggedIn(req, function(user_id){
    if(user_id){
      const ObjectId = mongoose.Types.ObjectId(req.body.id);
  		const body = req.body;
  		let newGrade = new RecipeModel.Grade({
  			user: user_id,
  			recipe: ObjectId,
  			grade: body.grade,
  			comment: body.comment
  		});
  		newGrade.save(function(err, grade){
  			if(err) res.status(500).json({error : err});
  			else {
  				RecipeModel.Recipe.updateOne({ _id : ObjectId }, { $push: { grades: grade._id } }).exec(function(err, doc){
  					if(err) res.status(500).json({error : err});
  					else res.status(200).json({res : 200});
  				});
  			}
  		});
  	}
  	else res.status(401).json({res : 401});
  });
});

////////////////////////////////////////////////////////////////////////////////

router.route('/labels')
// get labels
.get(function(req, res){
	RecipeModel.Label.find({}).exec(function(err, doc){
		if(err) res.status(500).json({error : err});
		else res.status(200).json({doc : doc});
	});
});

////////////////////////////////////////////////////////////////////////////////

router.route('/hashtags')
// get hashtags
.get(function(req, res){
	RecipeModel.hashtag.find({}).exec(function(err, doc){
		if(err) res.status(500).json({error : err});
		else res.status(200).json({doc : doc});
	});
});
////////////////////////////////////////////////////////////////////////////////

router.route('/search/hashtags')
// search hashtags
.post(function(req, res){
	RecipeModel.Hashtag.find({ name : { $regex : req.body.text }}).exec(function(err, doc){
		if(err) res.status(500).json({error : err});
		else res.status(200).json({doc : doc});
	});
});

////////////////////////////////////////////////////////////////////////////////
// 0 = not ok
// 1 = ok
// 2 = taken

function isLoggedIn(req, callback){
	if(req.query.id===undefined) callback(false);
	else {
		const user_id = mongoose.Types.ObjectId(req.query.id);
		UserModel.User.findOne({ _id : user_id }).exec(function(err, doc){
			if(err) callback(false);
			else if(doc) callback(doc._id);
			else callback(false);
		});
	}
  // return true;
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

function insertIngredient(ingredient, food_id, recipe_id){
	let ObjectId = mongoose.Types.ObjectId(food_id);
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

function addRecipeToCategory(id, recipe_id){
  let ObjectId = mongoose.Types.ObjectId(id);
  CategoryModel.Category.updateOne(
		{ _id: ObjectId },
		{ $push: { recipes: recipe_id } }
	).exec(function(err, doc){
		if(err) res.status(500).json({res : err});
		else return;
	});
}

function rmOldRecipeCategory(id, recipe_id){
  let ObjectId = mongoose.Types.ObjectId(id);
  CategoryModel.Category.updateOne(
		{ _id: ObjectId },
		{ $pull: { recipes: recipe_id } }
	).exec(function(err, doc){
		if(err) res.status(500).json({res : err});
		else return;
	});
}

// function updateCategory(id, recipe_id){
//   let ObjectId = mongoose.Types.ObjectId(id);
//   RecipeModel.Recipe.updateOne(
//     { _id: recipe_id },
//     { $pullAll: { categories } },
//     { $push: { categories: ObjectId } }
//   ).exec(function(err, doc){
//     if(err) res.status(500).json({res : err});
//     else return;
//   });
// }

module.exports = router;
