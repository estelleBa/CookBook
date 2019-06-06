import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import './App.css';
import Header from './views/Header.js';
import Home from './views/category/Index.js';
import Login from './views/home/Login.js';
import Register from './views/home/Register.js';
import RecipeIndex from './views/recipe/Index.js';
import Admin from './views/admin/Index.js';
import AdminUserCreate from './views/admin/UserCreate.js';
import AdminUserUpdate from './views/admin/UserUpdate.js';
import AdminUserDelete from './views/admin/UserDelete.js';
import AdminCategoryCreate from './views/admin/CategoryCreate.js';
import AdminRecipeCreate from './views/admin/RecipeCreate.js';
import AdminRecipeUpdate from './views/admin/RecipeUpdate.js';
import AdminRecipeDelete from './views/admin/RecipeDelete.js';

function App(){
	return (
		<Router>
			<div>
				<Route path="/" component={Header} />
				<Route path="/home" component={Home} />
				<Route path="/login" component={Login} />
				<Route path="/register" component={Register} />
				<Route path="/category/:category" component={RecipeIndex} />
				<Route path="/admin" component={Admin} />
				<Route path="/admin/user/create" component={AdminUserCreate} />
				<Route path="/admin/user/update" component={AdminUserUpdate} />
				<Route path="/admin/user/delete" component={AdminUserDelete} />
				<Route path="/admin/category/create" component={AdminCategoryCreate} />
				<Route path="/admin/recipe/create" component={AdminRecipeCreate} />
				<Route path="/admin/recipe/update" component={AdminRecipeUpdate} />
				<Route path="/admin/recipe/delete" component={AdminRecipeDelete} />
			</div>
		</Router>
	);
}

export default App;
