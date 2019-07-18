import React, { Component } from 'react';
import {GetCategories} from '../../api/Categories.js';
import CategoriesList from '../lists/CategoriesList.js';
import { Row } from 'reactstrap';

class CategoryIndex extends Component {

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
			<div className="container-fluid" style={{ minHeight: '100vh'}}>
				<Row style={{ margin: '20px 100px', justifyContent: 'center'}}>
					{this.state.categories.map((category) =>
						<CategoriesList key={category._id} category={category} />
		      )}
				</Row>
      </div>
    );
  }
}

export default CategoryIndex;
