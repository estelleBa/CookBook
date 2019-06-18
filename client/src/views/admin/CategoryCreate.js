import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import {CreateCategory} from '../../api/Admin.js';

class AdminCategoryCreate extends Component {

	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			name: '',
			color: ''
		}
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
		if(this.state.category != '-' && this.state.name != '' && this.state.color != ''){
			CreateCategory({'name':this.state.name, 'color':this.state.color}).then(data => {
				this.setState({
					redirect: true
				});
			});
		}
	}

	render() {
		let user = JSON.parse(localStorage.getItem('user'));
		if(this.state.redirect === true) return <Redirect to={{ pathname: '/admin', alert: 'category creation', alertType: 'info' }} />
		else if(user !== null && user.status === 1){
			return (
				<div>
					<form onSubmit={this.handleSubmit}>
						<label>
							Name:
							<input type="text" name="name" value={this.state.name} onChange={this.handleChange.bind(this)} />
						</label>
						<label>
							Color:
							<input type="text" name="color" value={this.state.color} onChange={this.handleChange.bind(this)} />
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

export default AdminCategoryCreate;
