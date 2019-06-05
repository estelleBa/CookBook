import React, { Component } from 'react';

class CategoriesList extends Component {

	constructor(props) {
    super(props);
  }

	componentDidMount() {
    console.log(this.props)
  }

	render() {
		const {category} = this.props;
		return (
			<div>{category.name}</div>
		)
	}
}

export default CategoriesList;
