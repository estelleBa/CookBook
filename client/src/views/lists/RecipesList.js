import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Col } from 'reactstrap';
import Image from 'react-bootstrap/Image'
import test from '../../images/test.jpg';

class RecipesList extends Component {

	constructor(props) {
    super(props);
  }

	render() {
		const {recipe} = this.props;
		return (
			<Link to={'/recipe/' + recipe._id} className="recipes-container" style={{ textDecoration: 'none' }}>
			<img src={require('../../images/test.jpg')} alt="product" className="recipe-img" />
					<div className="recipes-cubes">
						<p>{recipe.title}</p>
					</div>
			</Link>
		)
	}
}

export default RecipesList;
