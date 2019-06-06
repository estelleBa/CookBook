import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";

class AdminIndex extends Component {

	constructor(props) {
    super(props);
  }

	render() {
		let user = JSON.parse(localStorage.getItem('user'));
		if(localStorage.getItem('user_id') !== null && user.status === 1){
	    return (
				<div>
					<div>
						<ul>
							<li>
								Users
							</li>
							<li>
								<Link to="/admin/user/create">create</Link>
							</li>
							<li>
								<Link to="/admin/user/update">update</Link>
							</li>
							<li>
								<Link to="/admin/user/delete">delete</Link>
							</li>
						</ul>
					</div>
					<div>
						<ul>
							<li>
								Categories
							</li>
							<li>
								<Link to="/admin/category/create">create</Link>
							</li>
						</ul>
					</div>
					<div>
						<ul>
							<li>
								Recipes
							</li>
							<li>
								<Link to="/admin/recipe/create">create</Link>
							</li>
							<li>
								<Link to="/admin/recipe/update">update</Link>
							</li>
							<li>
								<Link to="/admin/recipe/delete">delete</Link>
							</li>
						</ul>
					</div>
				</div>
	    );
		}
		else {
			return <Redirect to='/home' />
		}
  }
}

export default AdminIndex;
