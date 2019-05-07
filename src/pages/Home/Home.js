import React, { Component } from 'react';
import './style.css'
import firebase from '../../firebase'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {  }

        this.update = this.update.bind(this)
        this.reroute = this.reroute.bind(this)
    }

    reroute() {
        console.log(this)
      }
    
      checkGame() {
        if(localStorage['gameCode']) {
            firebase.database().ref('/games/' + localStorage['gameCode'] ).once('value')
            .then(snap => {
              if(snap.val()) {
                if(snap.val().started) this.reroute()
              }
            })
          }
    }

    update(value, field) {
        this.setState({
            [field]: value
        })
    }

    isHost() {
        this.props.history.push('/lobby?host=true')
    }

    notHost() {
        this.props.history.push('/lobby')
    }

    render() { 
        return ( 
            <div>
                <h1 className="header">He Said She Said</h1>
                <div className='page-content center-up' >
                    <button onClick={() => this.isHost()} className='full-width-button'>New Game</button>
                    <button onClick={() => this.notHost()} className="inverse-button full-width-button" >Join Game</button>
                </div>
            </div>
         )
    }
}
 
export default Home;