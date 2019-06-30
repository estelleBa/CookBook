import axios from 'axios';

const address = 'http://localhost:8000';

export const CreateUser = (params) => {
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

export const CreateCategory = (params) => {
	let body = {
		'name': params.name,
		'color': params.color
	}
	return axios.post(address+'/categories/create', body, {
		params:{ "id": localStorage.getItem('user_id'), "admin": true },
		headers:{"Content-Type": "application/json"}
	})
  .then(res => {
		return res.data;
	});
}

export const CreateRecipe = (params) => {
	let body = {
		'title': params.title,
		'quantity': params.quantity,
		'time': params.time,
		'image': params.image,
		'ingredients': params.ingredients,
		'recipe': params.recipe,
		'categories': params.categories,
		'labels': params.labels,
		'hashtags': params.hashtags
	}
	return axios.post(address+'/recipes/create', body, {
		params:{ "id": localStorage.getItem('user_id'), "admin": true },
		headers:{"Content-Type": "application/json"}
	})
  .then(res => {
		return res.data;
	});
}

export const UpdateUser = (params) => {
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

export const UpdateCategory = (params) => {
	let body = {
		'category': params.category,
		'name': params.name,
		'color': params.color
	}
	return axios.post(address+'/categories/update', body, {
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

export const DeleteCategory = (param) => {
	let body = {
		'category': param
	}
	return axios.post(address+'/categories/delete', body, {
		params:{ "id": localStorage.getItem('user_id'), "admin": true },
		headers:{"Content-Type": "application/json"}
	})
  .then(res => {
		return res.data;
	});
}

export const SearchUser = (param) => {
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

export const GetCategories = () => {
	return axios.get(address+'/categories', {
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
