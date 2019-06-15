import axios from 'axios';

const address = 'http://localhost:8000';

export const PostRegister = (params) => {
	let body = {
		'login': params.login,
		'email': params.email,
		'password': params.password,
		'status': params.status
	}
	return axios.post(address+'/users/create', body, {
		params:{ "id": localStorage.getItem('user_id'), "admin": true },
		headers:{"Content-Type": "application/json"}
	})
  .then(res => {
		return res.data;
	});
}

export const PostUpdate = (params) => {
	let body = {
		'user_id': params.user_id,
		'login': params.login,
		'email': params.email,
		'password': params.password,
		'status': params.status
	}
	return axios.post(address+'/users/update', body, {
		params:{ "id": localStorage.getItem('user_id'), "admin": true },
		headers:{"Content-Type": "application/json"}
	})
  .then(res => {
		return res.data;
	});
}

export const DeleteUser = (param) => {
	let body = {
		'user_id': param
	}
	return axios.post(address+'/users/delete', body, {
		params:{ "id": localStorage.getItem('user_id'), "admin": true },
		headers:{"Content-Type": "application/json"}
	})
  .then(res => {
		return res.data;
	});
}

export const PostSearch = (param) => {
	let body = {
		'login': param
	}
	return axios.post(address+'/users/search', body, {
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
