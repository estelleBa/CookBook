import React, { Component } from 'react';
import { Redirect } from "react-router-dom";

class AdminRecipeCreate extends Component {

	constructor(props) {
    super(props);
  }

	render() {
		let user = JSON.parse(localStorage.getItem('user'));
		if(user !== null && user.status === 1){
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

export default AdminRecipeCreate;
