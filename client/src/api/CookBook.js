//import React, { Component } from 'react';
import axios from 'axios';

const address = 'http://localhost:8000';

export const PostLogin = (login, password) => {
	let obj = {
		['login']: login,
		['password']: password
	}
	axios.post(address+'/users/login', obj)
  .then(res => {
    console.log(res.data);
		if(res.data.error){

		}
		else if(res.data.doc){

		}
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
