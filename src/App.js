import React, { Component } from 'react';
import './App.css';
import {ActiveTicket} from "./components/ActiveTicket"
import { setConfig } from 'react-hot-loader'
import { hot } from 'react-hot-loader/root'


setConfig({
    ignoreSFC: true, // RHL will be __completely__ disabled for SFC
    pureRender: true, // RHL will not change render method
});

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header"></header>
        <main className="flex justify-center items-center h-screen">
            <ActiveTicket/>
        </main>
      </div>
    );
  }
}

export default hot(App);
