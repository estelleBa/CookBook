import axios from 'axios';

const address = 'http://localhost:8000/categories';

export const GetCategories = () => {
	return axios.get(address+'/', {
		params:{ "id": localStorage.getItem('user_id') },
		headers:{"Content-Type": "application/json"}
	})
  .then(res => {
		return res.data;
	});
}
