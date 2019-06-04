import axios from 'axios';

const address = 'http://localhost:8000';

export const PostLogin = (login, password) => {
	let body = {
		'login': login,
		'password': password
	}
	return axios.post(address+'/users/login', body, {
		params:{ "id": localStorage.getItem('user') },
		headers:{"Content-Type": "application/json"}
	})
  .then(res => {
		if(res.data.error){
			console.log(res.data.error);
		}
		else if(res.data.doc){
			localStorage.setItem('user', res.data.doc)
		}
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
