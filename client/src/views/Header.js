import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";

class Header extends Component {

	constructor(props) {
    super(props);
  }

	logout = () => {
		localStorage.removeItem('user');
		localStorage.removeItem('user_id');
		return <Redirect to='/login' />
	}

	render() {
		if(localStorage.getItem('user_id') !== null){
			let user = JSON.parse(localStorage.getItem('user'));
			if(user.status === 1){
				return (
					<ul>
						<li>
							<Link to="/admin">Admin</Link>
						</li>
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
							<Link to="/login" onClick={this.logout}>Logout</Link>
						</li>
					</ul>
				);
			}
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
