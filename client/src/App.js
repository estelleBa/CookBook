import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import './App.css';
import Header from './views/Header.js';
import Login from './views/home/Login.js';
import Home from './views/home/Home.js';

function App(){
	return (
		<Router>
			<div>
				<Route path="/" component={Header} />
				<Route path="/home" component={Home} />
				<Route path="/login" component={Login} />
			</div>
		</Router>
	);
}

export default App;
