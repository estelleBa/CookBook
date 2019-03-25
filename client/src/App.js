import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

class App extends Component {
  constructor() {
    super();
    this.test = 'null';
  }
  _testapi() {
    // axios.get("http://localhost:8080/users")
    // .then(function(res){
    //   console.log(res)
    // })
    // .catch(function(err) {
    //   console.log("Post Error : " +err);
    // });
    fetch('http://localhost:8080/users', {mode: 'no-cors'})
    .then(res => console.log('response: ', res))
    .catch(console.error)
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
        <button onClick={this._testapi}>TEST</button>
        <p>{this.test}</p>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
