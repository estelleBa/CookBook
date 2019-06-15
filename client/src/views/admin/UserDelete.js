import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import {DeleteUser, PostSearch} from '../../api/Admin.js';

class AdminUserDelete extends Component {

	constructor(props) {
    super(props);
		this.state = {
			redirect: false,
			username: '',
			userlist: [],
			user_id: ''
		}
  }

	_PostSearch = (value) => {
		if(value!==''){
			PostSearch(value).then(data => {
				if(data.doc){
					this.setState({
						userlist: data.doc
					});
				}
				else return
			});
		}
		else {
			this.setState({
				userlist: []
			});
		}
	}

	_selectUser = (id) => {
		this.setState({
			user_id: id
		});
	}

	handleChange = e => {
		const name = e.target.name;
    const value = e.target.value;

		this.setState({
			[name] : value
    });

		if(name==='username'){
			this._PostSearch(value);
		}
  }

	handleSubmit = e => {
		e.preventDefault();
		DeleteUser(this.state.user_id).then(data => {
			this.setState({
				redirect: true
			});
		});
	}

	render() {
		let user = JSON.parse(localStorage.getItem('user'));
		if(this.state.redirect === true) return <Redirect to={{ pathname: '/admin', alert: 'user deleted', alertType: 'info' }} />
		if(user !== null && user.status === 1){
			let _this = this

			return (
				<div>
					<form onSubmit={this.handleSubmit}>
						<label>
							Search user:
							<input type="text" name="username" value={this.state.username} onChange={this.handleChange.bind(this)} />
						</label>
						{this.state.userlist.map(function(user){
							return (
					      <div key={user._id}>
					         <div onClick={() => _this._selectUser(user._id)}>{user.login}</div>
					      </div>
							);
						})}
						<label>
							User id:
							<input type="text" name="user_id" value={this.state.user_id} readOnly />
						</label>
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

export default AdminUserDelete;
