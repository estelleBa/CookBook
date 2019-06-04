import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

class Header extends Component {

	constructor(props) {
    super(props);
		this.state = {
			view: '',
			redirect: false
    }
  }

	logout = () => {
		localStorage.removeItem('user');
		return <Redirect to='/login' />
	}

	render() {
		console.log('new header');
		console.log(localStorage.getItem('user'));
		if(localStorage.getItem('user') !== null){
			return (
				<ul>
					<li>
						<Link to="/home">Home</Link>
					</li>
					<li>
						<Link to="/login" onClick={this.logout}>Logout</Link>
					</li>
				</ul>
			);
		}
		else {
			return (
				<ul>
					<li>
						<Link to="/home">Home</Link>
					</li>
					<li>
						<Link to="/login">Login</Link>
					</li>
					<li>
						<Link to="/register">Register</Link>
					</li>
				</ul>
			);
		}
  }
}

export default Header;
