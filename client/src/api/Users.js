import axios from 'axios';

const address = 'http://localhost:8000/users';

export const PostLogin = (params) => {
	let body = {
		'login': params.login,
		'password': params.password
	}
	return axios.post(address+'/login', body, {
		params:{ "id": localStorage.getItem('user_id') },
		headers:{"Content-Type": "application/json"}
	})
  .then(res => {
		if(res.data.doc){
			localStorage.setItem('user_id', res.data.doc._id)
			localStorage.setItem('user', JSON.stringify(res.data.doc))
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
	return axios.post(address+'/create', body, {
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
	return axios.post(address+'/checkLogin', body, {
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
	return axios.post(address+'/checkMail', body, {
		params:{ "id": localStorage.getItem('user_id') },
		headers:{"Content-Type": "application/json"}
	})
  .then(res => {
		return res.data;
	});
}

export const GetFollow = () => {
	return axios.get(address+'/following', {
		params:{ "id": localStorage.getItem('user_id') },
		headers:{"Content-Type": "application/json"}
	})
  .then(res => {
		return res.data;
	});
}

export const PostFollow = (params) => {
	let body = {
		'id': params.id,
		'type': params.type
	}
	return axios.post(address+'/follow', body, {
		params:{ "id": localStorage.getItem('user_id') },
		headers:{"Content-Type": "application/json"}
	})
  .then(res => {
		return res.data;
	});
}
