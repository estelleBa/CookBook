import React, { Component } from 'react';
import {GetRecipe} from '../../api/Recipes.js';
import { Link } from "react-router-dom";
import { Row } from 'reactstrap';
import '../../css/card.css';

class RecipeCard extends Component {

  constructor() {
    super();
    this.state = {
      recipe: [],
      chef: [],
      boards: [],
      categories: [],
      grades: [],
      hashtags: [],
      ingredients: [],
      labels: [],
      likes: []
    }
  }

	componentDidMount() {
		const { recipe } = this.props.match.params;
		this._getRecipe(recipe);
  }

	_getRecipe = (recipe) => {
		GetRecipe(recipe).then(data => {
			if(!data.doc) return;
			else {console.log(data.doc)
				this.setState({
					recipe: data.doc,
          chef: data.doc.chef,
          boards: data.doc.chef,
          categories: data.doc.categories,
          grades: data.doc.grades,
          hashtags: data.doc.hashtags,
          ingredients: data.doc.ingredients,
          labels: data.doc.labels,
          likes: data.doc.likes
				});
			}
		});
	}

	render() {
    return (
			<div className="container-fluid" style={{ minHeight: '100vh'}}>
        <Row style={{ margin: '20px 0px 0px 0px', justifyContent: 'center'}}>
          <div className="recipe_header">
            <div className="recipe_title" style={{ display: 'flex'}}>
              <h2>{this.state.recipe.title}</h2>
              {this.state.labels.map((label) =>
    						<div className="recipe_labels" style={{ backgroundColor: '#' + label.color }}></div>
    		      )}
            </div>
            <div className="recipe_chef">
              <div style={{ display: 'flex'}}>
                <Link to={ '/user/' + this.state.chef._id } style={{ textDecoration: 'none' }}>
                  <img src={require('../../images/test.jpg')} alt={this.state.chef.login} className="user_img" />
                </Link>
                <Link to={ '/user/' + this.state.chef._id } style={{ textDecoration: 'none' }}>
                  <p>{this.state.chef.login}</p>
                </Link>
              </div>
            </div>
          </div>
        </Row>
				<Row style={{ margin: '10px 0px', justifyContent: 'center'}}>
          <div className="recipe_card">
          toto
          </div>
          <div className="recipe_note">
          toto
          </div>
				</Row>
      </div>
		)
	}
}

export default RecipeCard;
