//import React, { Component } from 'react';
import axios from 'axios';

const address = 'http://9dd99f6e.ngrok.io';

export const PostLogin = (login, password) => {
	let obj = {
		['login']: login,
		['password']: password
	}
	console.log(obj)
	axios.post(address+'/users/login', obj)
  .then(res => {
    console.log(res.data);
	});
}

export const GetRecipes = (login, password) => {
	let obj = {
		['login']: login,
		['password']: password
	}
	console.log(obj)
	axios.post(address+'/users/login', obj)
  .then(res => {
    console.log(res.data);
	});
}
