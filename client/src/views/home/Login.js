import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import {PostLogin} from '../../api/CookBook.js';

class Login extends Component {

	constructor(props) {
    super(props);
		this.state = {
			view: '',
			redirect: false,
			login: '',
			password: ''
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
		if(localStorage.getItem('user') !== null) return;
		if(this.state.login === '' || this.state.password === '') return;
		PostLogin(this.state.login, this.state.password).then(data => {
			if(!data) return;
			else {
				if(data.error){
					console.log(data.error)
				}
				else if(data.doc){
					this.setState({
						view: '/home',
						redirect: true
					});
				}
			}
		});
	}

	render() {
		if(this.state.redirect === true){
			return <Redirect to={this.state.view} />
		}
		else if(localStorage.getItem('user') !== null){
			return <Redirect to='/home' />
		}
		else {
	    return (
				<div>
					<form onSubmit={this.handleSubmit}>
		        <label>
		          Login:
		          <input type="text" name="login" value={this.state.login} onChange={this.handleChange.bind(this)} />
		        </label>
						<label>
		          Password:
		          <input type="password" name="password" value={this.state.password} onChange={this.handleChange.bind(this)} />
		        </label>
		        <input type="submit" value="Login" />
		      </form>
				</div>
	    );
		}
  }
}

export default Login;
