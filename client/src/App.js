import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import './App.css';
import Header from './views/Header.js';
import Home from './views/category/index.js';
import Login from './views/home/Login.js';
import Register from './views/home/Register.js';
import RecipesIndex from './views/recipe/index.js';

function App(){
	return (
		<Router>
			<div>
				<Route path="/" component={Header} />
				<Route path="/home" component={Home} />
				<Route path="/login" component={Login} />
				<Route path="/register" component={Register} />
				<Route path="/category/:category" component={RecipesIndex} />
			</div>
		</Router>
	);
}

export default App;
