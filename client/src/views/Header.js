import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import { Row, Col, Input } from 'reactstrap';
import '../css/navbar.css';

class Header extends Component {

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
					<div className="container-fluid navbar">
						<Row>
							<Col>
								<Link className="navlink" to="/admin">Admin</Link>
								<Link className="navlink" to="/home">Home</Link>
								<Link className="navlink" to="/login" onClick={this.logout}>Logout</Link>
							</Col>
						</Row>
						<div style={{ display : 'flex', marginRight: '18px' }}><Input style={{ marginRight: '10px' }} type="text" /><div className="searchbar"><p>V</p></div></div>
					</div>
				);
			}
			else {
				return (
					<div className="container-fluid navbar">
						<Row >
							<Col>
								<Link className="navlink" to="/home">Home</Link>
								<Link className="navlink" to="/login" onClick={this.logout}>Logout</Link>
							</Col>
						</Row>
						<div style={{ display : 'flex', marginRight: '18px' }}><Input style={{ marginRight: '10px' }} type="text" /><div className="searchbar"><p>V</p></div></div>
					</div>
				);
			}
		}
		else {
			return (
				<div className="container-fluid navbar">
					<Row >
						<Col>
							<Link className="navlink" to="/home">Home</Link>
							<Link className="navlink" to="/login">Login</Link>
							<Link className="navlink" to="/register">Register</Link>
						</Col>
					</Row>
					<div style={{ display : 'flex', marginRight: '18px' }}><Input style={{ marginRight: '10px' }} type="text" /><div className="searchbar"><p>V</p></div></div>
				</div>
			);
		}
  }
}

export default Header;
