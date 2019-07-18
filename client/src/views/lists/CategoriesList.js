import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Col } from 'reactstrap';
import '../../css/list.css';

class CategoriesList extends Component {

	constructor(props) {
    super(props);
  }

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
