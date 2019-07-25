import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import {PostRegister, CheckLogin, CheckMail} from '../../api/Users.js';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import '../../css/form.css';

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
				isMailValid: false
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
		if(this.state.isLoginValid===true&&this.state.isMailValid===true&&this.state.isPassValid===true){
			PostRegister({'login':this.state.login, 'email':this.state.email, 'password':this.state.password}).then(data => {
				this.setState({
					redirect: true
				});
			});
		}
		else return;
	}

	render() {
		if(this.state.redirect === true) return <Redirect to={{ pathname: '/login', alert: 'user creation', alertType: 'info' }} />
		else if(localStorage.getItem('user_id') !== null){
			return <Redirect to='/home' />
		}
		else {
	    return (
				<div className="container-fluid" style={{ minHeight: '100vh'}}>
					<Form onSubmit={this.handleSubmit} className="form">
						<FormGroup>
			        <Label className="label-form">
			          LOGIN:
			        </Label>
							<Input className="input-form" type="text" name="login" value={this.state.login} onChange={this.handleChange.bind(this)} />
							<p className="danger">{this.state.loginAlert}</p>
						</FormGroup>
						<FormGroup>
							<Label className="label-form">
			          EMAIL:
			        </Label>
							<Input className="input-form" type="text" name="email" value={this.state.email} onChange={this.handleChange.bind(this)} />
							<p className="danger">{this.state.mailAlert}</p>
						</FormGroup>
						<FormGroup>
							<Label className="label-form">
			          PASSWORD:
			        </Label>
							<Input className="input-form" type="password" name="password" value={this.state.password} onChange={this.handleChange.bind(this)} />
						</FormGroup>
						<FormGroup>
							<Label className="label-form">
			          PASSWORD CONFIRMATION:
							</Label>
		          <Input className="input-form" type="password" name="password2" value={this.state.password2} onChange={this.handleChange.bind(this)} />
							<p className="danger">{this.state.passAlert}</p>
						</FormGroup>
		        <Input type="submit" value="REGISTER" className="btn-form"/>
		      </Form>
				</div>
	    );
		}
  }
}

export default Register;
