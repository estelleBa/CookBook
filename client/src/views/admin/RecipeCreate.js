import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import {CreateRecipe, GetCategories} from '../../api/Admin.js';

class AdminRecipeCreate extends Component {

	constructor(props) {
    super(props);
		this.ingredients = [];
		this.ingredientID = 0;
		this.categories = [];
		this.state = {
			redirect: false,
			categoryList: [],
			title: '',
			quantity: '',
			time: '',
			recipe: '',
			ingredients: [],
			ingName: '',
			ingQuantity: '',
			ingUnity: '',
			categories: [],
			labels: [],
			hashtags: []
		}
  }

	componentDidMount() {
    this._getCategories();
  }

	_getCategories = () => {
		GetCategories().then(data => {
			if(!data.doc) return;
			else {
				this.setState({
					categoryList: data.doc
				});
			}
		});
	}

	_addIngredient = e => {
		e.preventDefault();
		if(this.state.ingName === '' || this.state.ingQuantity === '' || this.state.ingUnity === '') return;

		this.ingredientID ++;
		this.ingredients[this.ingredientID] = {"name":this.state.ingName, "quantity":this.state.ingQuantity, "unity":this.state.ingUnity};
		this.setState({
			ingredients : this.ingredients
		});
	}

	_delIngredient = (e, id) => {
		e.preventDefault();
		delete this.ingredients[id];
		this.setState({
			ingredients : this.ingredients
		});
	}

	handleChangeCheckbox = e => {
		let pos = this.categories.indexOf(e.target.value);
		if(pos == -1) this.categories.push(e.target.value);
		else this.categories.splice(pos, 1);
		this.setState({
			categories : this.categories
		});
	}

	handleChange = e => {
		const name = e.target.name;
		const value = e.target.value;

		this.setState({
			[name] : value
		});
	}

	handleSubmit = e => {
		e.preventDefault();
		console.log(this.state)
		// if(this.state.isLoginValid===true&&this.state.isMailValid===true&&this.state.isPassValid===true&&this.state.isStatusValid===true){
		// 	CreateUser({'login':this.state.login, 'email':this.state.email, 'password':this.state.password, 'status':this.state.status}).then(data => {
		// 		this.setState({
		// 			redirect: true
		// 		});
		// 	});
		// }
		// else return;
	}

	render() {
		let _this = this;
		let user = JSON.parse(localStorage.getItem('user'));
		if(this.state.redirect === true) return <Redirect to={{ pathname: '/admin', alert: 'recipe creation', alertType: 'info' }} />
		else if(user !== null && user.status === 1){
			return (
				<div>
					<form onSubmit={this.handleSubmit}>
		        <label>
		          Title:
							<input type="text" name="title" value={this.state.title} onChange={this.handleChange.bind(this)} />
		        </label>
						<label>
		          Quantity (person):
		          <input type="number" name="quantity" value={this.state.quantity} onChange={this.handleChange.bind(this)} />
		        </label>
						<label>
		          Time:
							<input type="text" name="time" value={this.state.time} onChange={this.handleChange.bind(this)} />
		        </label>
						<p>Ingredients:</p>
						<label>Name:<input type="text" name="ingName" value={this.state.ingName} onChange={this.handleChange.bind(this)} /></label>
						<label>Quantity:<input type="text" name="ingQuantity" value={this.state.ingQuantity} onChange={this.handleChange.bind(this)} /></label>
						<label>Unit:<input type="text" name="ingUnity" value={this.state.ingUnity} onChange={this.handleChange.bind(this)} /></label>
						<button onClick={this._addIngredient}>+</button>
						<div id="ingredients">
						{
						 this.state.ingredients.map(function(item, index){

							 return <div key={index}>{index}, {item.name}, {item.quantity}, {item.unity} <button onClick={(e) => {_this._delIngredient(e, index)}}>-</button></div>;
						})}
						</div>
						<p>Recipe:</p>
						<textarea name="recipe" value={this.state.recipe} onChange={this.handleChange.bind(this)} cols={40} rows={10} />
						<p>Categories</p>
						{
						 this.state.categoryList.map(function(item){
							 return <div><input type="checkbox" name="category" value={item._id} onChange={_this.handleChangeCheckbox.bind(this)} />{item.name}</div>
						})}

		        <input type="submit" value="Create" />
		      </form>
				</div>
	    );
		}
		else {
			return <Redirect to='/home' />
		}
  }
}

export default AdminRecipeCreate;
