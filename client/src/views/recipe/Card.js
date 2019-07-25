import React, { Component } from 'react';
import {GetRecipe} from '../../api/Recipes.js';
import { Link } from "react-router-dom";
import { Row, Col } from 'reactstrap';
import Image from 'react-bootstrap/Image'
import test from '../../images/test.jpg';

class RecipeCard extends Component {

  constructor() {
    super();
    this.state = {
      recipe: []
    }
  }

	componentDidMount() {
		const { recipe } = this.props.match.params;
		this._getRecipe(recipe);
  }

	_getRecipe = (recipe) => {
		GetRecipe(recipe).then(data => {
			if(!data.doc) return;
			else {
        console.log(data.doc)
				this.setState({
					recipe: data.doc
				});
			}
		});
	}

	render() {
    return (
			<div className="container-fluid" style={{ minHeight: '100vh'}}>
				<Row style={{ margin: '20px 100px', justifyContent: 'center'}}>
				</Row>
      </div>
		)
	}
}

export default RecipeCard;
