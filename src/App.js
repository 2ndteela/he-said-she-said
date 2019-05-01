import React, {Component} from 'react';
import {BrowserRouter as Router, Route } from 'react-router-dom'


import Home from './pages/Home/Home'
import EndScreen from './pages/EndScreen/EndScreen.js'
import Lobby from './pages/Lobby/Lobby'
import Play from './pages/Play/play'
import Results from './pages/Results/Results'
import firebase from './firebase'

class App extends Component {
    constructor(props) {
      super(props);
      this.state = {  }

      this.reroute = this.reroute.bind(this)
  }

  reroute() {
    //this.props.history.push('/lobby?code=' + localStorage['gameCode'])
  }

  checkGame() {
    if(localStorage['gameCode']) {
        firebase.database().ref('/games').once('value')
        .then(snap => {
          const list = snap.val()
          for(const game in list) {
            if(list[game].key === localStorage['gameCode']) this.reroute()
          }
        })
      }
}

componentDidMount() {
  this.checkGame()
}

  render() {
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
}

export default App;