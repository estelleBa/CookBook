import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import {CreateRecipe, GetCategories} from '../../api/Admin.js';

class AdminRecipeCreate extends Component {

	constructor(props) {
    super(props);
		this.state = {
			redirect: false,
			categorieList: [],
			title: '',
			quantity: '',
			ingredients: [],
			steps: [],
			categories: [],
			labels: [],
			hashtags: []
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

	handleChange = e => {
		const name = e.target.name;
		const value = e.target.value;

		this.setState({
			[name] : value
		});
	}

	render() {
		let user = JSON.parse(localStorage.getItem('user'));
		if(this.state.redirect === true) return <Redirect to={{ pathname: '/admin', alert: 'recipe creation', alertType: 'info' }} />
		else if(user !== null && user.status === 1){
			return (
				<div>
					<form onSubmit={this.handleSubmit}>
		        <label>
		          Title:
		          <input type="text" name="title" value={this.state.title} onChange={this.handleChange.bind(this)} />
		        </label>
						<label>
		          Quantity (person):
		          <input type="number" name="quantity" value={this.state.quantity} onChange={this.handleChange.bind(this)} />
		        </label>
		        <input type="submit" value="Create" />
		      </form>
				</div>
	    );
		}
		else {
			return <Redirect to='/home' />
		}
  }
}

export default AdminRecipeCreate;
