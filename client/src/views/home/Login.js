import React, { Component } from 'react';
import {PostLogin} from '../../api/CookBook.js';
//import Home from './Home.js';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

class Login extends Component {

	constructor(props) {
    super(props);
		this.state = {
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
		if(this.state.login === '' || this.state.password === '') return;
		PostLogin(this.state.login, this.state.password, function(data){
			console.log('toto')
			// return <Redirect to='/Home'/>;
			//return <Home />;
		});
	}

	render() {
    return (
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
    );
  }
}

export default Login;
