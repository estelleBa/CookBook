import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import {PostRegister, CheckLogin, CheckMail} from '../../api/Users.js';

class Register extends Component {

	constructor(props) {
    super(props);
		this.state = {
			view: '',
			redirect: false,
			login: '',
			email: '',
			password: '',
			password2: '',
			isLoginValid: false,
			isMailValid: false,
			isPassValid: false,
			loginAlert: '',
			mailAlert: '',
			passAlert: ''
    }
  }

	_checkLogin = (value) => {
		if(value===''){
			this.setState({
				loginAlert: '',
				isLoginValid: false
			});
		}
		else {
			CheckLogin(value).then(data => {
				if(!data.doc) return;
				if(data.doc === false){
					this.setState({
						loginAlert: 'login already exists',
						isLoginValid: false
					});
				}
				else {
					this.setState({
						loginAlert: '',
						isLoginValid: true
					});
				}
			});
		}
	}

	_checkMail = (value) => {
		if(value===''){
			this.setState({
				mailAlert: '',
				isMailValid: false
			});
		}
		else {
			CheckMail(value).then(data => {
				if(!data.doc) return;
				if(data.doc === false){
					this.setState({
						mailAlert: 'email not valid',
						isMailValid: false
					});
				}
				else {
					this.setState({
						mailAlert: '',
						isMailValid: true
					});
				}
			});
		}
	}

	_checkPass = (value) => {
		if(value==='' || this.state.password===''){
			this.setState({
				passAlert: '',
				isPassValid: false
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

	handleChange = e => {
		const name = e.target.name;
    const value = e.target.value;

		this.setState({
			[name] : value
    });

		if(name==='login'){
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
		if(localStorage.getItem('user_id') !== null) return;
		if(this.state.isLoginValid===true&&this.state.isMailValid===true&&this.state.isPassValid===true){
			PostRegister({'login':this.state.login, 'email':this.state.email, 'password':this.state.password}).then(data => {
				return <Redirect to='/login' />
			});
		}
		else return;
	}

	render() {
		if(this.state.redirect === true){
			return <Redirect to={this.state.view} />
		}
		else if(localStorage.getItem('user_id') !== null){
			return <Redirect to='/home' />
		}
		else {
	    return (
				<div>
					<form onSubmit={this.handleSubmit}>
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
		        <input type="submit" value="Register" />
		      </form>
				</div>
	    );
		}
  }
}

export default Register;
