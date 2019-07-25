import axios from 'axios';

const address = 'http://localhost:8000/recipes';

export const GetRecipes = () => {
	return axios.get(address+'/', {
		params:{ "id": localStorage.getItem('user_id') },
		headers:{"Content-Type": "application/json"}
	})
  .then(res => {
		return res.data;
	});
}

export const GetRecipe = (param) => {
	return axios.get(address+'/show/'+param, {
		params:{ "id": localStorage.getItem('user_id') },
		headers:{"Content-Type": "application/json"}
	})
  .then(res => {
		return res.data;
	});
}
