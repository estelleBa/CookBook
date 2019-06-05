import React, { Component } from 'react';
import {GetCategories} from '../../api/Categories.js';
import CategoriesList from '../lists/CategoriesList.js';

class CategoriesIndex extends Component {

	constructor(props) {
    super(props);
		this.state = {
      categories: []
    }
  }

	componentDidMount() {
    this._getCategories();
  }

	_getCategories = () => {
		GetCategories().then(data => {
			if(!data.doc) return;
			else {
				this.setState({
					categories: data.doc
				});
			}
		});
	}

	render() {
    return (
			<div>
				{this.state.categories.map((category) =>
					<CategoriesList key={category._id} category={category} />
	      )}
      </div>
    );
  }
}

export default CategoriesIndex;
