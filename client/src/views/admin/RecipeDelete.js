import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

class AdminRecipeDelete extends Component {

	constructor(props) {
    super(props);
		this.state = {
			recipes: []
		}
  }

	render() {
		let user = JSON.parse(localStorage.getItem('user'));
		if(localStorage.getItem('user_id') !== null && user.status === 1){
	    return (
				<div>
				</div>
	    );
		}
		else {
			return <Redirect to='/home' />
		}
  }
}

export default AdminRecipeDelete;
