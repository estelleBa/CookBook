//import React, { Component } from 'react';
import axios from 'axios';

const address = 'http://7e4c1e22.ngrok.io:8000';

export const PostLogin = (login, password) => {
	let obj = {
		['login']: login,
		['password']: password
	}
	axios.post(address+'/users/login', {obj})
  .then(res => {
    console.log(res.data);
	});
}
