//import React, { Component } from 'react';
import axios from 'axios';

const address = 'http://localhost:8000';

export const PostLogin = (login, password) => {
	if(localStorage.getItem('user') !== null){
		localStorage.removeItem('user')
		console.log('already in')
	}
	else {
		let obj = {
			['login']: login,
			['password']: password
		}
		axios.post(address+'/users/login', obj)
	  .then(res => {
			console.log(localStorage.getItem('user'));
			if(res.data.error){
				console.log(res.data.error);
			}
			else if(res.data.doc){
				localStorage.setItem('user', res.data.doc.login)
			}
		});
	}
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
