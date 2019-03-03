import React, { Component } from 'react';
import './App.css';
import {ActiveTicket} from "./components/ActiveTicket"

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

export default App;
