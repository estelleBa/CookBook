import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import {PostLogin} from '../../api/Users.js';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import '../../css/form.css';
import yummy from '../../images/yummy.png';

class Login extends Component {

	constructor(props) {
    super(props);
		this.state = {
			view: '',
			redirect: false,
			login: '',
			password: '',
			alert: ''
    }
  }

	_alertStyle = (type) => {
		let color;
		switch(type) {
			case 'info': color='#d8f1ff'; break;
		}
		return {
     backgroundColor: color
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
		if(localStorage.getItem('user_id') !== null) return;
		if(this.state.login === '' || this.state.password === '') return;
		PostLogin({'login':this.state.login, 'password':this.state.password}).then(data => {
			if(!data) return;
			else {
				if(data.error){
					if(data.error==='not found'){
						this.setState({
							alert: 'login not found'
						});
					}
					else if(data.error==='bad password'){
						this.setState({
							alert: 'bad password'
						});
					}
				}
				else if(data.doc){
					this.setState({
						alert: '',
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
		else if(localStorage.getItem('user_id') !== null){
			return <Redirect to='/home' />
		}
		else {
	    return (
				<div className="container-fluid" style={{ minHeight: '100vh'}}>
				{ (this.props.location.alert === undefined) ? '' : <div style={this._alertStyle(this.props.location.alertType)}>{ this.props.location.alert }</div> }
					<Form onSubmit={this.handleSubmit} className="form">
						<FormGroup>
			        <Label className="label-form">
			          LOGIN:
							</Label>
		          <Input className="input-form" type="text" name="login" value={this.state.login} onChange={this.handleChange.bind(this)} />
						</FormGroup>
						<FormGroup>
							<Label className="label-form">
			          PASSWORD:
			        </Label>
							<Input className="input-form" type="password" name="password" value={this.state.password} onChange={this.handleChange.bind(this)} />
							<p className="danger">{this.state.alert}</p>
						</FormGroup>
		        <Input type="submit" value="LOGIN" className="btn-form"/>
		      </Form>
					<div className="container"><img src={yummy} alt="yummy" className="yummy" /></div>
				</div>
	    );
		}
  }
}

export default Login;
