import logo from './logo.svg';
import './App.css';
import react, {Component, useState} from 'react';
import Mint from './Components/Mint';
import NavBar from './Components/nav';

class App extends Component {

    render() {

      return (
        <div className="App">
          <NavBar/>
          <Mint/>
        </div>
      );
    }
}

export default App;

