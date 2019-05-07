import React, { Component } from 'react';
import queryString from 'query-string'
import Input from '../../components/Input/Input'
import firebase from '../../firebase'

class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            gameCode: '',
            host: false,
            players: 1,
            games: [],
            firebaseKey: '',
            joined: false
         }
         this.handleUpdate = this.handleUpdate.bind(this)
    }

    generateCode() {
        const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let gameCode = ''

        for(let i = 0; i < 4; i++) gameCode += LETTERS[Math.floor(Math.random() * 25) ]
        return gameCode
    }

    checkCode(code) {
        this.state.games.forEach(game => {
            if(game.key === code) return false
        })

        return true
    }

    componentDidMount() {
        this.getData()
        const temp = queryString.parse(window.location.search)
        const code =localStorage['gameCode']
      
      if(temp.host)      
        this.makeNewGame()

        if(code) {
            firebase.database().ref('/games/' + localStorage['gameCode']).once('value')
            .then(snap => {
                if(snap.val()) {
                    if(snap.val().status === 'lobby') {
                        this.setState({
                            joined: true
                        })
                    }
                    else if(snap.val().status === 'playing') {
                        this.props.history.push('/play')
                    }
                } 
            })
        }
    }

    handleUpdate(value, field) {
        if(field === 'gameCode') value = value.toUpperCase()
        this.setState({
            [field]: value
        })
    }

    joinGame() {
        firebase.database().ref('/games').once('value')
        .then(snap => {
            const list = snap.val()
            for(const game in list) {
                if(game === this.state.gameCode.toUpperCase()) {
                    localStorage['gameCode'] = game 
                    let i = 0

                    for(const story in list[game].stories) {
                        if(parseInt(story, 10) > i ) {
                            i = story
                        }
                    }

                    i++

                    localStorage['playerId'] = i

                    firebase.database().ref('/games/' + game + '/stories/' + i).set({
                        name: 'Story ' + i
                    })

                    this.subscribe()

                    this.setState({
                        joined: true
                    })
                }
            } 
        })
    }

    subscribe() {
        firebase.database().ref('/games/' +  localStorage['gameCode'] + '/').on('value', snap => {
            const list = snap.val()

            if(list.status === 'playing') this.props.history.push('/play')

            let count = 0 
            for(const i in list.stories) 
                if(parseInt(i, 10) > count) 
                    count = parseInt(i, 10) 

            count++
            this.setState({
                players: count
            })
        })
    }

    startGame() {
        firebase.database().ref('/games/' + localStorage['gameCode'] + '/count' ).set(this.state.players)
        firebase.database().ref('/games/' + localStorage['gameCode'] + '/status' ).set('playing')
        firebase.database().ref('/games/' + localStorage['gameCode'] + '/submissions' ).set(0)

        this.props.history.push('/play')
    }

    getData() {

        firebase.database().ref('/games').once('value')
        .then(snap => {
            const list = snap.val()
            let arr = []
            for(const game in list) 
                arr.push(list[game])

            this.setState({
                games: arr
            })
        })

    }

    makeNewGame() {
        let code = this.generateCode()
        while(!this.checkCode(code)) code = this.generateCode()

        firebase.database().ref('/games/' + code + '/').set({
            status: 'lobby',
            stories: {
                0: {
                    name: 'Story 0'
                }
            }
        })

        this.setState({
            gameCode: code,
            host: true,
            playerId: 0
        })

        localStorage['gameCode'] = code
        localStorage['playerId'] = 0
            
        this.subscribe()
    }

    exitGame() {
        firebase.database().ref('/games/' + localStorage['gameCode'] + '/stories/' + localStorage['playerId']).remove()
        .then(() => {
            localStorage['gameCode'] = ''
            localStorage['playerId'] = ''
            this.props.history.push('/')
        })
    }

    makeBody() {
        if(this.state.host) {
            return (
            <div className="page-content center-up">
                <h2>Game Code: {this.state.gameCode} </h2>
                <div>Just wait a moment while your friends join</div>
                <div style={{padding: '16px 0'}}>Number of players: {this.state.players}</div>
                <button onClick={() => this.startGame()} >Start Game</button>
            </div>
            )

        }
        else if(!this.state.host && this.state.joined) {
            return (
                <div className="page-content center-up">
                    <div>Waiting for the host to start the game</div>
                    <h3>{this.state.players} Players</h3>
                    <button onClick={() => this.exitGame()} >Leave Game</button>
                </div>
            )
        }
        return (
            <div className="page-content center-up">
                <Input val={this.state.gameCode} field={'gameCode'} onUpdate={this.handleUpdate} label='Game Code' ></Input>
                <div style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                    <button style={{marginTop: '8px'}} className="inverse-button" onClick={() => this.joinGame()} >Join</button>
                    {this.state.gameCode}
                </div>
            </div>
        )
    }

    render() { 
        
        return ( 
            <div>
                <h1 className="header">Lobby</h1>
                {this.makeBody()}
            </div>
         );
    }
}
 
export default Lobby;