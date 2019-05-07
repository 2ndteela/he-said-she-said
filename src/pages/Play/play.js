import React, { Component } from 'react';
import Input from '../../components/Input/Input.js'
import firebase from '../../firebase'

class Play extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            stage: 0,
            submitted: false,
            response: '',
            values: ['him', 'her', 'where', 'what', 'heOne', 'sheOne', 'heTwo', 'sheTwo', 'moral', 'hashtag'],
            tutorial: true,
            submissions: 0
         }

         this.submitResult = this.submitResult.bind(this)
         this.updateState = this.updateState.bind(this)
    }

    componentDidMount() {
        const game = localStorage['gameCode']

        this.setState({
            idx: localStorage['playerId'],
        })
        firebase.database().ref('/games/' + game + '/submissions').on('value', snap => {

            if(snap.val() === this.state.maxCount) {
                this.setState({
                    submissions: 0,
                    submitted: false
                })

                //add code to reset submission in db to 0
            }

            this.setState({
                submissions: snap.val()
            })
        })

        firebase.database().ref('/games/' + game + '/count').once('value')
        .then(snap => {
            console.log(snap.val(), game)
            this.setState({
                maxCount: snap.val()
            })
        })
    }

    makePrompt() {
        if(this.state.submitted) return <h3>Waiting on other players to submit...</h3>
        if(this.state.stage === 0) return <h3>Give us a guy's name</h3>
        if(this.state.stage === 1) return <h3>Now a girl's name</h3>
        if(this.state.stage === 2) return <h3>Where are they at?</h3>
        if(this.state.stage === 3) return <h3>What are they doing?</h3>
        if(this.state.stage === 4) return <h3>What does the guy say first</h3>
        if(this.state.stage === 5) return <h3>How does the girl respond?</h3>
        if(this.state.stage === 6) return <h3>Now the guy again</h3>
        if(this.state.stage === 7) return <h3>And the girl one more time</h3>
        if(this.state.stage === 8) return <h3>What's the moral of the story?</h3>
        if(this.state.stage === 9) return <h3>And finish it with a hashtag</h3>
        if(this.state.stage === 10) return <h3>That's it! Sit back and relax</h3>
    }

    makeInput() {
        if(this.state.submitted) return null
        return (
            <div style={{width: '100%', alignItems: 'flex-start'}}>                    
                <Input field="response" val={this.state.response} onUpdate={this.updateState} />
                <button style={{marginTop: '16px'}} onClick={() => this.submitResult()} >Submit</button>
            </div>
        )
    }

    updateState(val, field) {
        this.setState({
            [field]: val
        })
    }

    submitResult() {
        const game = localStorage['gameCode']

        firebase.database().ref('/games/' + game + '/' + this.state.idx + '/' + this.state.idx).set(this.state.response)
        firebase.database().ref('/games/' + game + '/submissions').set(parseInt(this.state.submissions, 10) + 1)

        //add code to update story and rotate to the next key

        this.setState({
            submitted: true,
            response: '',
            stage: this.state.stage > 9 ? this.state.stage : this.state.stage + 1
        })
    }

    render() { 
        if(this.state.tutorial) 
            return( 
                <div>
                    <h2 className="header">Play</h2>
                    <div className="page-content">
                        He said, she said started out as a game where you would write down a response on a peice of paper,
                        fold the paper so the next person could not see and then pass. It's a game where you write a colletive 
                        story about a boy and girl but you have no idea what the person before you has written. Have Fun!
                        <button style={{marginTop: '16px'}} onClick={() => this.setState({tutorial: false})} >I'm Ready</button>
                    </div>
                </div>
            )

        return ( 
            <div>
                <h2 className="header">Play</h2>
                <div className="page-content">
                    {this.makePrompt()}
                    {this.makeInput()}
                    {this.state.submissions}
                    {this.state.idx}
                    {this.state.maxCount}
                </div>
            </div>
         );
    }
}
 
export default Play;