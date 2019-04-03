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
		body.quantity !== undefined && body.quantity !== '' /*&&
		body.ingredients !== undefined && body.ingredients.length > 0 &&
		body.steps !== undefined && body.steps.length > 0*/) {
			let newRecipe = new RecipeModel.Recipe({
				title: body.title,
				quantity: body.quantity,
				time: body.time
			});res.status(200).json({res : newRecipe});
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

module.exports = router;
