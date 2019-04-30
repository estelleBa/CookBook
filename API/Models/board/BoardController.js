let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
let bodyParser = require('body-parser');
let async = require('async');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

////////////////////////////////////////////////////////////////////////////////

let BoardModel = require('./board');
let RecipeModel = require('../recipe/Recipe');
let UserModel = require('../user/User');
let CategoryModel = require('../category/Category');

////////////////////////////////////////////////////////////////////////////////
// BOARDS
////////////////////////////////////////////////////////////////////////////////

router.route('/')
// get boards
.get(function(req, res){
  BoardModel.Board.find({}).exec(function(err, doc){
		if(err) res.status(500).json({res : err});
    else res.status(200).json({res : doc});
  });
});

////////////////////////////////////////////////////////////////////////////////

router.route('/create')
// create board
.post(function(req, res){
	const user_id = isLoggedIn(req);
  if(user_id){
		const body = req.body;
		if(body.name !== undefined && body.name !== ''){
			let newBoard = new BoardModel.Board({
				name: body.name,
				admin: user_id
			});
			newBoard.save(function(err){
				if(err) res.status(500).json({res : err});
				else res.status(200).json({res : 200});
		}
		else res.json({res : 0});
	}
	else res.status(401).json({res : 401});
});

////////////////////////////////////////////////////////////////////////////////

router.route('/update/:id')
// update board
.put(function(req, res){
	const user_id = isLoggedIn(req);
	const ObjectId = mongoose.Types.ObjectId(req.params.id);
	if(user_id){
		const body = req.body;
	  if(body.name !== undefined && body.name !== ''){
			BoardModel.Board.findOneAndUpdate({ _id : ObjectId, admin : user_id }, {$set: {name: body.name}}).exec(function(err, doc){
				if(err) res.status(500).json({res : err});
				else res.status(200).json({res : 200});
	    });
	  }
	}
  else res.status(401).json({res : 401});
});

////////////////////////////////////////////////////////////////////////////////

router.route('/add')
// add recipe to board
.post(function(req, res){
	const user_id = isLoggedIn(req);
	if(user_id){
		const board_id = mongoose.Types.ObjectId(req.body.board_id);
		const recipe_id = mongoose.Types.ObjectId(req.body.recipe_id);
		BoardModel.Board.findOneAndUpdate({ _id : board_id, admin : user_id }, { $push: { recipes: recipe_id } }).exec(function(err, doc){
			if(err) res.status(500).json({res : err});
			else if(!doc) res.status(404).json({res : err});
			else {
				RecipeModel.Recipe.updateOne(
					{ _id: recipe_id },
					{ $push: { boards: board_id } }
				).exec(function(err, doc){
					if(err) res.status(500).json({res : err});
					else res.status(200).json({res : 200});
				});
			}
    });
	}
  else res.status(401).json({res : 401});
});
////////////////////////////////////////////////////////////////////////////////

router.route('/show/:id')
// show board
.get(function(req, res){
  BoardModel.Board.findOne({ _id : req.params.id })
	.populate({
			path: 'admin recipes followers'
	}).exec(function(err, doc){
		if(err) res.status(500).json({res : err});
    else res.status(200).json({res : doc});
  });
});

////////////////////////////////////////////////////////////////////////////////

router.route('/search/:text')
// search boards
.get(function(req, res){
	BoardModel.Board.find({ name : { $regex : req.params.text }}).exec(function(err, doc){
		if(err) res.status(500).json({res : err});
    else res.status(200).json({res : doc});
  });
});

////////////////////////////////////////////////////////////////////////////////

router.route('/delete/:id')
// delete board
.delete (function(req, res){
  const user_id = isLoggedIn(req);
  if(user_id){
    const ObjectId = mongoose.Types.ObjectId(req.params.id);
    BoardModel.Board.findOne({ _id : ObjectId, admin : user_id }).exec(function(err, doc){
      if(err) res.status(500).json({res : err});
      else if(!doc) res.status(404).json({res : 404});
      else {
              BoardModel.Board.deleteOne({ _id : ObjectId }).exec(function(err, doc){
                if(err) res.status(500).json({res : err});
                else {
                  UserModel.User.updateMany(
                    { },
                    { $pull: { boards: ObjectId }
                  ).exec(function(err, doc){
                    if(err) res.status(500).json({res : err});
                    else {
                      RecipeModel.Recipe.updateMany(
                        { },
                        { $pull: { boards: ObjectId } }
                      ).exec(function(err, doc){
                        if(err) res.status(500).json({res : err});
                        else {
                          // RecipeModel.Recipe.updateMany(
                          //   { },
                          //   { $pull: { recipes: ObjectId } }
                          // ).exec(function(err, doc){
                          //   if(err) res.status(500).json({res : err});
                          //   else {
													// 		RecipeModel.Ingredient.deleteOne({ _id : ObjectId }).exec(function(err, doc){
													// 			if(err) res.status(500).json({res : err});
													// 		});
                          //   }
                          });
                        }
                      });
                    }
                  });
                }
              });
    });
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
