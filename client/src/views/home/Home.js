import React, { Component } from 'react';
import {PostLogin} from '../../api/CookBook.js';

class Home extends Component {

	constructor(props) {
    super(props);
		this.state = {
      login: '',
			password: ''
    }
  }


	render() {
    return (
			<text>Home
      </text>
    );
  }
}

export default Home;
