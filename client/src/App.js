import React from 'react';
import './App.css';
import Login from './views/home/Login.js';
import Home from './views/home/Home.js';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function App(){
	return (
		<Router>
			<div>
				<Header />

				<Route path="/home" component={Home} />
				<Route path="/login" component={Login} />
			</div>
		</Router>
	);
}

function Header() {
  return (
    <ul>
      <li>
        <Link to="/home">Home</Link>
      </li>
      <li>
        <Link to="/login">login</Link>
      </li>
      <li>
        <Link to="/register">register</Link>
      </li>
    </ul>
  );
}

export default App;
