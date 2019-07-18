import React, { Component } from 'react';
import {GetRecipesFromCategory} from '../../api/Categories.js';
import RecipesList from '../lists/RecipesList.js';
import { Row } from 'reactstrap';

class RecipeIndex extends Component {

	constructor(props) {
    super(props);
		this.state = {
      recipes: []
    }
  }

	componentDidMount() {
		const { category } = this.props.match.params;
		this._getRecipesFromCategory(category);
  }

	_getRecipesFromCategory = (category) => {
		GetRecipesFromCategory(category).then(data => {
			if(!data.doc) return;
			else {console.log(data)
				this.setState({
					recipes: data.doc.recipes
				});
			}
		});
	}

	render() {
		return (
			<div className="container-fluid" style={{ minHeight: '100vh'}}>
				<Row style={{ margin: '20px 100px', justifyContent: 'center'}}>
				{this.state.recipes.map((recipe) =>
					<RecipesList key={recipe._id} recipe={recipe} />
	      )}
				</Row>
      </div>
		)
	}
}

export default RecipeIndex;
