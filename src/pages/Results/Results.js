import React, { Component } from 'react';
import firebase from '../../firebase'
import './style.css'

class Results extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            story: {}
         }
    }

    componentDidMount() {

        const game = localStorage['gameCode']
        const idx = localStorage['playerId']

        firebase.database().ref(`/games/${game}/stories/${idx}`).once('value')
        .then(snap => {
            this.setState({
                story: snap.val()
            })
        })
    }
    goHome() {
        localStorage['gameCode'] = ''
        localStorage['playerId'] = ''

        this.props.history.push('/')
    }

    render() { 
        return ( 
            <div style={{width: '100%'}} >
                <button className="inverse-button exit-button" onClick={() => this.goHome()} >New Game</button>
                <h1 className="header">Results</h1>
                <div className="page-content story-body">
                    <div className="story-intro" ><b>{this.state.story.him}</b> and <b>{this.state.story.her}</b> are at <b>{this.state.story.where}</b> <b>{this.state.story.what}</b> when <b>{this.state.story.him}</b> says:</div>
                    <div className="conversation-box">
                        <div><b>{this.state.story.him}:</b> {this.state.story.heOne}</div>
                        <div><b>{this.state.story.her}:</b> {this.state.story.sheOne} </div>
                        <div><b>{this.state.story.him}:</b> {this.state.story.heTwo}</div>
                        <div><b>{this.state.story.her}:</b> {this.state.story.sheTwo} </div>
                    </div>
                    <div id="moral-box" > <span>And so we see, <b>{this.state.story.moral}</b></span></div>
                    <div><b>#{this.state.story.hashtag}</b></div>
                </div>
            </div>
         );
    }
}
 
export default Results;