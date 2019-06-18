import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import {GetCategories, DeleteCategory} from '../../api/Admin.js';

class AdminCategoryDelete extends Component {

	constructor(props) {
    super(props);
		this.state = {
			redirect: false,
			category: '-',
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

	handleChange = e => {
		const name = e.target.name;
		const value = e.target.value;

		this.setState({
			[name] : value
		});
	}

	handleSubmit = e => {
		e.preventDefault();
		if(this.state.category != '-'){
			DeleteCategory(this.state.category).then(data => {
				this.setState({
					redirect: true
				});
			});
		}
	}

	render() {
		let user = JSON.parse(localStorage.getItem('user'));
		if(this.state.redirect === true) return <Redirect to={{ pathname: '/admin', alert: 'category deleted', alertType: 'info' }} />
		else if(localStorage.getItem('user_id') !== null && user.status === 1){
	    return (
				<div>
					<form onSubmit={this.handleSubmit}>
						<select name="category" onChange={this.handleChange.bind(this)} value={this.state.category}>
							<option>-</option>
							{
							 this.state.categories.map(function(item){
								 return <option>{item.name}</option>
							})}
						</select>
						<input type="submit" value="Delete" />
					</form>
				</div>
	    );
		}
		else {
			return <Redirect to='/home' />
		}
  }
}

export default AdminCategoryDelete;
