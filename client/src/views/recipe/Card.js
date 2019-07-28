import React, { Component } from 'react';
import {GetRecipe} from '../../api/Recipes.js';
import {PostFollow} from '../../api/Users.js';
import { Link } from "react-router-dom";
import { Row } from 'reactstrap';
import '../../css/card.css';

class RecipeCard extends Component {

  constructor() {
    super();
    this.ingQuantity = [];
    this.state = {
      height: 0,
      recipe: [],
      date: '',
      quantity: 0,
      ingQuantity: [],
      chef: [],
      boards: [],
      categories: [],
      grades: [],
      hashtags: [],
      ingredients: [],
      labels: [],
      likes: [],
      follow: ''
    }
  }

	componentDidMount() {
    let root_div = document.getElementById('container-root').clientHeight;
    let navbar = document.getElementById('root-nav').clientHeight;
    let height = root_div - navbar
    this.setState({
      height: height + 'px'
    });

		const { recipe } = this.props.match.params;
		this._getRecipe(recipe);
  }

	_getRecipe = (recipe) => {
		GetRecipe(recipe).then(data => {
			if(!data.doc) return;
			else {console.log(data.doc)
        let follow = (data.doc.chef.followers.indexOf(localStorage.getItem('user_id')) === -1) ? 'Follow' : 'Unfollow';
        let date = data.doc.creationDate.split('T');
        data.doc.ingredients.map((ing) =>
          this.ingQuantity.push(ing.quantity)
        );
				this.setState({
					recipe: data.doc,
          date: date[0],
          quantity: data.doc.quantity,
          ingQuantity: this.ingQuantity,
          chef: data.doc.chef,
          boards: data.doc.chef,
          categories: data.doc.categories,
          grades: data.doc.grades,
          hashtags: data.doc.hashtags,
          ingredients: data.doc.ingredients,
          labels: data.doc.labels,
          likes: data.doc.likes,
          follow: follow
				});
			}
		});
	}

  _followStateChange = () => {
    PostFollow({'id': this.state.chef._id, 'type': 'u'}).then(data => {
      if(data.res === 1){
        this.setState({
          follow: 'Unfollow'
        });
      }
      else {
        this.setState({
          follow: 'Follow'
        });
      }
    });
  }

  _downQuantity = () => {
    if(this.state.quantity === 1) return;
    else {
      this.ingQuantity = [];
      let quantity = this.state.quantity-1;
      let n;
      for(let i = 0;i<this.state.ingredients.length;i++){
        n = this.state.ingredients[i].quantity * quantity;
        this.ingQuantity[i] = n;
      }
      this.setState({
        quantity: quantity,
        ingQuantity: this.ingQuantity
      });
    }
  }

  _upQuantity = () => {
    if(this.state.quantity === 50) return;
    else {
      this.ingQuantity = [];
      let quantity = this.state.quantity+1;
      let n;
      for(let i = 0;i<this.state.ingredients.length;i++){
        n = this.state.ingredients[i].quantity * quantity;
        this.ingQuantity[i] = n;
      }
      this.setState({
        quantity: quantity,
        ingQuantity: this.ingQuantity
      });
    }
  }

	render() {
    return (
			<div id="container-height" className="container-fluid" style={{ height: this.state.height }}>
        <Row style={{ margin: '20px 0px 0px 0px', justifyContent: 'center'}}>
          <div className="recipe_header">
            <div className="recipe_title" style={{ display: 'flex'}}>
              <h2>{this.state.recipe.title}</h2>
              {this.state.labels.map((label) =>
    						<div key={label._id} className="recipe_labels" style={{ backgroundColor: '#' + label.color }}></div>
    		      )}
            </div>
            <p className="recipe_date">{this.state.date}</p>
            <div className="recipe_chef">
              <div style={{ display: 'flex'}}>
                <Link to={ '/user/' + this.state.chef._id } style={{ textDecoration: 'none' }}>
                  <img src={require('../../images/test.jpg')} alt={this.state.chef.login} className="user_img" />
                </Link>
                <Link to={ '/user/' + this.state.chef._id } style={{ textDecoration: 'none' }}>
                  <p>{this.state.chef.login}</p>
                </Link>
                <div className="follow_btn">
                  <p onClick={this._followStateChange} className={this.state.follow}>{this.state.follow}</p>
                </div>
              </div>
            </div>
          </div>
        </Row>
				<Row style={{ margin: '10px 0px', justifyContent: 'center'}}>
          <div className="recipe_card">
          <div className="recipe_mention">
            <div className="label_list">
              {this.state.labels.map((lbl) =>
                <p style={{ backgroundColor: '#' + lbl.color }} key={lbl._id}>{lbl.name}</p>
              )}
            </div>
            <div className="hashtag_list">
              {this.state.hashtags.map((ht) =>
                <p key={ht._id}>#{ht.name}</p>
              )}
            </div>
          </div>
          <div className="blue_line"></div>
            <div className="recipe_info">
              <div style={{ display: 'flex' }}><p>Quantity: </p><p className="qty_btn" onClick={this._downQuantity}>-</p><p> {this.state.quantity} </p><p className="qty_btn" onClick={this._upQuantity}>+</p><p> person(s)</p></div>
              <div style={{ marginLeft: 'auto' }}><p>Time: {this.state.recipe.time}</p></div>
            </div>
            <div className="blue_line"></div>
            <div className="recipe_ingr">
              <h5>Ingredients</h5>
              {this.state.ingredients.map((ing, i) =>
    						<div key={ing.food._id} className="ingr_list" style={{ display: 'flex' }}>
                  <p>{ing.food.name} {this.ingQuantity[i]} {ing.unity}</p>
                </div>
    		      )}
            </div>
            <div className="blue_line"></div>
            <div className="recipe_text">
              <h5>Recipe</h5>
              <p>{this.state.recipe.recipe}</p>
            </div>
          </div>
          <div className="recipe_note">
            <div className="recipe_img"><img style={{ width: '100%'}} src={require('../../images/test.jpg')} alt="food" /></div>
          </div>
				</Row>
      </div>
		)
	}
}

export default RecipeCard;
