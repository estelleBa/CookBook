import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import {CreateRecipe, GetCategories, GetLabels, SearchHashtag} from '../../api/Admin.js';

class AdminRecipeCreate extends Component {

	constructor(props) {
    super(props);
		this.ingredients = [];
		this.ingredientID = 0;
		this.hts = [];
		this.htID = 0;
		this.categories = [];
		this.labels = [];
		this.state = {
			redirect: false,
			categoryList: [],
			labelList: [],
			hashtagList: [],
			title: '',
			quantity: '',
			time: '',
			recipe: '',
			ingredients: [],
			ingName: '',
			ingQuantity: '',
			ingUnity: '-',
			categories: [],
			labels: [],
			hashtags: [],
			htName: ''
		}
  }

	componentDidMount() {
    this._getCategories();
		this._getLabels();
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

	_getLabels = () => {
		GetLabels().then(data => {
			if(!data.doc) return;
			else {
				this.setState({
					labelList: data.doc
				});
			}
		});
	}

	_postSearch = (value) => {
		if(value!==''){
			SearchHashtag(value).then(data => {
				if(data.doc){
					this.setState({
						hashtagList: data.doc
					});
				}
			});
		}
		else {
			this.setState({
				hashtagList: []
			});
		}
	}

	_addIngredient = e => {
		e.preventDefault();
		if(this.state.ingName === '' || this.state.ingQuantity === '') return;
		e.target.value = '';

		this.ingredients[this.ingredientID] = {"name":this.state.ingName, "quantity":this.state.ingQuantity, "unity":this.state.ingUnity};
		this.ingredientID ++;
		this.setState({
			ingredients : this.ingredients,
			ingName : '',
			ingQuantity : ''
		});
	}

	_delIngredient = (e, id) => {
		e.preventDefault();
		delete this.ingredients[id];
		this.setState({
			ingredients : this.ingredients
		});
	}

	_addHashtag = e => {
		e.preventDefault();
		if(this.state.htName === '') return;;

		this.hts[this.htID] = {"name":this.state.htName};
		this.htID ++;
		this.setState({
			hashtags : this.hts,
			htName : ''
		});
	}

	_delHashtag = (e, id) => {
		e.preventDefault();
		delete this.hts[id];
		this.setState({
			hashtags : this.hts
		});
	}

	handleChangeCheckbox = e => {
		if(e.target.name=='categories'){
			let pos = this.categories.indexOf(e.target.value);
			if(pos == -1) this.categories.push(e.target.value);
			else this.categories.splice(pos, 1);
			this.setState({
				categories : this.categories
			});
		}
		else if(e.target.name=='labels'){
			let pos = this.labels.indexOf(e.target.value);
			if(pos == -1) this.labels.push(e.target.value);
			else this.labels.splice(pos, 1);
			this.setState({
				labels : this.labels
			});
		}
	}

	handleChange = e => {
		const name = e.target.name;
		const value = e.target.value;

		this.setState({
			[name] : value
		});

		if(name==='htName'){
			this._postSearch(value);
		}
	}

	handleSubmit = e => {
		e.preventDefault();
		console.log(this.state)
		if(this.state.title!==''&&this.state.quantity!==''&&this.state.time!==''&&this.state.recipe!==''&&this.state.ingredients.length>0&&this.state.categories.length>0){
			CreateRecipe(
				{'title':this.state.title, 'quantity':this.state.quantity, 'time':this.state.time, 'recipe':this.state.recipe,
				'ingredients':this.state.ingredients,'categories':this.state.categories,'hashtags':this.state.hashtags,'labels':this.state.labels}
			).then(data => {
				console.log(data)
				this.setState({
					redirect: true
				});
			});
		}
		else return;
	}

	render() {
		let _this = this;
		let user = JSON.parse(localStorage.getItem('user'));
		if(this.state.redirect === true) return <Redirect to={{ pathname: '/admin', alert: 'recipe creation', alertType: 'info' }} />
		else if(user !== null && user.status === 1){
			return (
				<div>
					<form onSubmit={this.handleSubmit} >
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
						<label>Quantity:<input type="number" name="ingQuantity" value={this.state.ingQuantity} onChange={this.handleChange.bind(this)} /></label>
						<label>Unit:
							<select name="ingUnity" onChange={this.handleChange.bind(this)} value={this.state.ingUnity}>
								<option>-</option>
								<option>K</option>
								<option>G</option>
								<option>L</option>
								<option>CL</option>
								<option>CaC</option>
								<option>CaS</option>
							</select>
						</label>
						<button onClick={this._addIngredient}>+</button>
						<div id="ingredients">
						{
						 this.state.ingredients.map(function(item, index){

							 return <div key={index}>{index}, {item.name}, {item.quantity}, {item.unity} <button onClick={(e) => {_this._delIngredient(e, index)}}>-</button></div>;
						})}
						</div>

						<p>Recipe:</p>
						<textarea name="recipe" value={this.state.recipe} onChange={this.handleChange.bind(this)} cols={40} rows={10} />

						<p>Hashtags:</p>
						<input type="text" name="htName" value={this.state.htName} onChange={this.handleChange.bind(this)} />
						<button onClick={this._addHashtag}>+</button>
						{this.state.hashtagList.map(function(hashtag){
							return (
								<div key={hashtag._id}>
									 <div >{hashtag.name}</div>
								</div>
							);
						})}

						<div id="hashtags">
						{
						 this.state.hashtags.map(function(item, index){

							 return <div key={index}>{item.name} <button onClick={(e) => {_this._delHashtag(e, index)}}>-</button></div>;
						})}
						</div>

						<p>Categories</p>
						{
						 this.state.categoryList.map(function(item){
							 return <div><input type="checkbox" name="categories" value={item._id} onChange={_this.handleChangeCheckbox.bind(this)} />{item.name}</div>
						})}

						<p>Labels</p>
						{
						 this.state.labelList.map(function(item){
							 return <div><input type="checkbox" name="labels" value={item._id} onChange={_this.handleChangeCheckbox.bind(this)} />{item.name}</div>
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
