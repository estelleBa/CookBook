import axios from 'axios';

const address = 'http://localhost:8000';

export const PostLogin = (params) => {
	let body = {
		'login': params.login,
		'password': params.password
	}
	return axios.post(address+'/users/login', body, {
		params:{ "id": localStorage.getItem('user_id') },
		headers:{"Content-Type": "application/json"}
	})
  .then(res => {
		console.log(res.status)
		if(res.data.error){
			console.log(res.data.error);
		}
		else if(res.data.doc){
			localStorage.setItem('user_id', res.data.doc._id)
			localStorage.setItem('user', res.data.doc)
		}
		return res.data;
	});
}

export const PostRegister = (params) => {
	let body = {
		'login': params.login,
		'email': params.email,
		'password': params.password
	}
	return axios.post(address+'/users/create', body, {
		params:{ "id": localStorage.getItem('user_id') },
		headers:{"Content-Type": "application/json"}
	})
  .then(res => {
		return res.data;
	});
}

export const CheckLogin = (param) => {
	let body = {
		'login': param
	}
	return axios.post(address+'/users/checkLogin', body, {
		params:{ "id": localStorage.getItem('user_id') },
		headers:{"Content-Type": "application/json"}
	})
  .then(res => {
		return res.data;
	});
}

export const CheckMail = (param) => {
	let body = {
		'email': param
	}
	return axios.post(address+'/users/checkMail', body, {
		params:{ "id": localStorage.getItem('user_id') },
		headers:{"Content-Type": "application/json"}
	})
  .then(res => {
		return res.data;
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
