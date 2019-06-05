import React, { Component } from 'react';
import { Link } from "react-router-dom";

class RecipesList extends Component {

	constructor(props) {
    super(props);
  }

	render() {
		const {recipe} = this.props;
		return (
			<Link to={'/recipe/' + recipe._id}>
				<div>
				<p>{recipe.title}</p>
				</div>
			</Link>
		)
	}
}

export default RecipesList;
