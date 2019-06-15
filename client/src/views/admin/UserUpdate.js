import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import {PutUpdate, PostSearch, CheckLogin, CheckMail} from '../../api/Admin.js';


class AdminUserUpdate extends Component {

	constructor(props) {
    super(props);
		this.state = {
			redirect: false,
			login: '',
			email: '',
			password: '',
			password2: '',
			username: '',
			userlist: [],
			user_id: '',
			isLoginValid: true,
			isMailValid: true,
			isPassValid: true,
			loginAlert: '',
			mailAlert: '',
			passAlert: ''
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

	_checkLogin = (value) => {
		if(value===''){
			this.setState({
				loginAlert: '',
				isLoginValid: true
			});
		}
		else {
			CheckLogin(value).then(data => {
				if(data.doc === false){
					this.setState({
						loginAlert: 'login already exists',
						isLoginValid: false
					});
				}
				else if(data.doc === true) {
					this.setState({
						loginAlert: '',
						isLoginValid: true
					});
				}
				else return;
			});
		}
	}

	_checkMail = (value) => {
		if(value===''){
			this.setState({
				mailAlert: '',
				isMailValid: true
			});
		}
		else {
			CheckMail(value).then(data => {
				if(data.doc === false){
					this.setState({
						mailAlert: 'email not valid',
						isMailValid: false
					});
				}
				else if(data.doc === true) {
					this.setState({
						mailAlert: '',
						isMailValid: true
					});
				}
				else return;
			});
		}
	}

	_checkPass = (value) => {
		if(value==='' && this.state.password===''){
			this.setState({
				passAlert: '',
				isPassValid: true
			});
		}
		else {
			if(value===this.state.password){
				this.setState({
					passAlert: '',
					isPassValid: true
				});
			}
			else {
				this.setState({
					passAlert: 'passwords not equal',
					isPassValid: false
				});
			}
		}
	}

	_selectUser = (id) => {
		console.log(id)
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
		else if(name==='login'){
			this._checkLogin(value);
		}
		else if(name==='email'){
			this._checkMail(value);
		}
		else if(name==='password2'){
			this._checkPass(value);
		}
  }

	handleSubmit = e => {
		e.preventDefault();
		if(this.state.user_id !== ''){
			if(this.state.isPassValid===false || this.state.isMailValid===false || this.state.isLoginValid===false) return;
			PutUpdate({'user_id':this.state.user_id, 'login':this.state.login, 'email':this.state.email, 'password':this.state.password}).then(data => {
				this.setState({
					redirect: true
				});
			});
		}
	}

	render() {
		let user = JSON.parse(localStorage.getItem('user'));
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
		        <label>
		          Login:
		          <input type="text" name="login" value={this.state.login} onChange={this.handleChange.bind(this)} />
							{this.state.loginAlert}
		        </label>
						<label>
		          Email:
		          <input type="text" name="email" value={this.state.email} onChange={this.handleChange.bind(this)} />
							{this.state.mailAlert}
		        </label>
						<label>
		          Password:
		          <input type="password" name="password" value={this.state.password} onChange={this.handleChange.bind(this)} />
		        </label>
						<label>
		          Password confirmation:
		          <input type="password" name="password2" value={this.state.password2} onChange={this.handleChange.bind(this)} />
							{this.state.passAlert}
		        </label>
		        <input type="submit" value="Update" />
		      </form>
				</div>
	    );
		}
		else {
			return <Redirect to='/home' />
		}
  }
}

export default AdminUserUpdate;
