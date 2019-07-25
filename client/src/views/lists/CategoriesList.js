import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../../css/list.css';

class CategoriesList extends Component {

	render() {
		const {category} = this.props;
		return (
				<Link to={'/category/' + category._id} style={{ backgroundColor: '#'+category.color, textDecoration: 'none' }} className="cubes-container">
					<div className="categories-cubes">
						<p>{category.name}</p>
					</div>
				</Link>
		)
	}
}

export default CategoriesList;
