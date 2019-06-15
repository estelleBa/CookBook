let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
let bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

////////////////////////////////////////////////////////////////////////////////

let CategoryModel = require('./Category');

////////////////////////////////////////////////////////////////////////////////
// CATEGORIES
////////////////////////////////////////////////////////////////////////////////

router.route('/')
// get categories
.get(function(req, res){
  CategoryModel.Category.find({}).exec(function(err, doc){
		if(err) res.status(500).json({error : err});
    else res.status(200).json({doc : doc});
  });
});

////////////////////////////////////////////////////////////////////////////////

router.route('/create')
// create category
.post(function(req, res){
	isLoggedIn(req, function(user_id){
    if(user_id){
  		const body = req.body;
  		if(body.name !== undefined && body.name !== '' &&
  		body.color !== undefined && body.color !== '') {
  			let newCategory = new CategoryModel.Category({
  				name: body.name,
  				color: body.color
  			});
        console.log('toto')
  			newCategory.save(function(err){
  				if(err) res.status(500).json({res : err});
  				else res.status(200).json({res : 200});
  			});
  		}
  		else res.json({res : 0});
    }
    else res.status(401).json({res : 401});
  });
});

////////////////////////////////////////////////////////////////////////////////

router.route('/show/:id')
// show categorie
.get(function(req, res){
  CategoryModel.Category.findOne({ _id : req.params.id })
	.populate({
			path: 'recipes'
	}).exec(function(err, doc){
		if(err) res.status(500).json({error : err});
    else res.status(200).json({doc : doc});
  });
});

////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////
// 0 = not ok
// 1 = ok
// 2 = taken

function isLoggedIn(req, callback){
	// if(req.query.id===undefined) callback(false);
	// else {
	// 	const user_id = mongoose.Types.ObjectId(req.query.id);
	// 	UserModel.User.findOne({ _id : user_id }).exec(function(err, doc){
	// 		if(err) callback(false);
	// 		else if(doc) callback(doc._id);
	// 		else callback(false);
	// 	});
	// }
   return true;
}

module.exports = router;
