import React from 'react';
import {BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './pages/Home/Home'
import EndScreen from './pages/EndScreen/EndScreen.js'
import Lobby from './pages/Lobby/Lobby'
import Play from './pages/Play/play'
import Results from './pages/Results/Results'

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/lobby" component={Lobby} />
          <Route path='/play' component={Play} />
          <Route path='/results' component={Results} />
          <Route path='/endscreen' component={EndScreen} />
        </div>
      </Router>
    </div>
  );
}

export default App;