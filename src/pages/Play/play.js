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
            submissions: 0,
            showEnd: false
         }

         this.submitResult = this.submitResult.bind(this)
         this.updateState = this.updateState.bind(this)
    }

    componentDidMount() {
        const game = localStorage['gameCode']
        const ref = firebase.database().ref('/games/' + game + '/nextRound')
         
        ref.on('value', snap => {
            if(snap.val()) {
                this.setState({ submitted: false })
                if(this.state.stage === 10) this.setState({ showEnd: true})
            }
            
        })

        firebase.database().ref('/games/' + game + '/').once('value')
        .then(snap => {

            let arr = []
            for(let idx in snap.val().stories) 
                arr.push(idx)

                this.setState({
                    maxCount: parseInt(snap.val().count, 10),
                    keys: arr,
                    currentKey: localStorage['playerId']
                }, () => {
                    
                    if(localStorage['currentKey']) {
                        const resetStage = parseInt(localStorage['currentKey'], 10)
                        let startingKey = this.state.keys[localStorage['playerId']]
                        for(let i = 0; i < resetStage; i++) {
                            if(startingKey === this.state.keys[this.state.keys.length - 1]) startingKey = this.state.keys[0]

                            else {
                                const idx = this.state.keys.indexOf(this.state.currentKey)
                                startingKey = this.state.keys[idx + 1]
                            }
                        }
            
                        this.setState({ stage: resetStage})
                    }
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
        if(this.state.stage === 8) return <h3>What's the moral of the story? (And so we see...) </h3>
        if(this.state.stage === 9) return <h3>And finish it with a hashtag</h3>
        if(this.state.stage === 10) return <h3>That's it! Sit back and relax</h3>
    }

    makeInput() {
        if(this.state.submitted) return null
        else if (this.state.stage === 10)   return null
        else if (!this.state.response) return(
            <div style={{width: '100%', alignItems: 'flex-start'}}>                    
            <Input field="response" val={this.state.response} onUpdate={this.updateState} />
        </div>
        )
        return (
            <div style={{width: '100%', alignItems: 'flex-start'}}>                    
                <Input field="response" val={this.state.response} onUpdate={this.updateState} />
                <button style={{marginTop: '16px'}} onClick={() => this.submitResult()} >Submit</button>
            </div>
        )
    }

    goHome() {
        localStorage['gameCode'] = ''
        localStorage['playerId'] = ''
        localStorage['currentKey'] = ''

        this.props.history.push('/')
    }

    endButton() {
        if(this.state.showEnd) return (
            <div id="end-button">
                <button onClick={() => this.props.history.push('/results')} >Show My Story!</button>
            </div>
        )
        return null
    }

    updateState(val, field) {
        this.setState({
            [field]: val
        })
    }

    submitResult() {
        const game = localStorage['gameCode']
        const ref = firebase.database().ref('/games/' + game + '/nextRound')

        ref.once('value').then(snap => {
            if(snap.val()) ref.set(false)
        })

        firebase.database().ref('/games/' + game + '/stories/' + this.state.currentKey + '/' + this.state.values[this.state.stage])
        .set(this.state.response)

        firebase.database().ref('/games/' + game + '/stories/').once('value')
        .then(snap => {
            const stories = snap.val()
            let allSubmitted = true

            stories.forEach(s => {
                if(!s[this.state.values[this.state.stage]]) {
                    console.log('false')
                    allSubmitted = false
                }
            })

            if(allSubmitted) {
                ref.set(true)
                if(this.state.stage === 10) this.setState({ showEnd: true })
            }
            else this.setState({submitted: true})

            this.setState({
                response: '',
                stage: this.state.stage > 9 ? this.state.stage : this.state.stage + 1
            }, () => { localStorage['currentKey'] = this.state.stage} )
    
            if(this.state.currentKey === this.state.keys[this.state.keys.length - 1]) 
                this.setState({
                    currentKey: this.state.keys[0],
                }, () => { localStorage['currentKey'] = this.state.stage})
            
            else {
                const idx = this.state.keys.indexOf(this.state.currentKey)
                this.setState({
                    currentKey: this.state.keys[idx + 1]
                }, () => { localStorage['currentKey'] = this.state.stage} )
            }
        })
    }


    componentWillUnmount() {
        if(localStorage['isHost']) {
            firebase.database().ref('/games/' + localStorage['gameCode'] + '/status').remove()
        }
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
                <button className="inverse-button exit-button" onClick={() => this.goHome()} >Exit</button>
                <h2 className="header">Play</h2>
                <div className="page-content">
                    {this.makePrompt()}
                    {this.makeInput()}
                    {this.endButton()}
                </div>
            </div>
         );
    }
}
 
export default Play;