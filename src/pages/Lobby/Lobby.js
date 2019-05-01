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
      
      if(temp.host)      
        this.makeNewGame()
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

                    for(const story in list[game]) i++

                    firebase.database().ref('/games/' + game + '/' + i).set({
                        name: 'Story ' + i
                    })

                    firebase.database().ref('/games/' + game + '/').on('value', snap => {
                        const list = snap.val()

                        if(list.started) this.props.history.push('/play')

                        let count = 0 
                        for(const i in list) count++

                        this.setState({
                            players: count
                        })
                    })

                    this.setState({
                        joined: true
                    })
                }
            } 
        })
    }

    startGame() {
        firebase.database().ref('/games/' + localStorage['gameCode']).set({
            started: true
        })

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

            firebase.database().ref('/games/' + code + '/0').set({
                name: 'Story 0'
            })

                this.setState({
                    gameCode: code,
                    host: true,
                    playerId: 0
                })
                localStorage['gameCode'] = code

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
                <div>
                    <div>Waiting for the host to start the game</div>
                    <h3>{this.state.players} Players</h3>
                </div>
            )
        }
        return (
            <div className="page-content center-up">
                <Input val={this.state.gameCode} field={'gameCode'} onUpdate={this.handleUpdate} label='Game Code' ></Input>
                <div style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                    <button style={{marginTop: '8px'}} className="inverse-button" onClick={() => this.joinGame()} >Join</button>
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