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
            players: [],
            games: [],
            firebaseKey: ''
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
        this.setState({
            [field]: value
        })
    }

    joinGame() {
        firebase.database().ref('/games').once('value')
        .then(snap => {
            const list = snap.val()
            for(const game in list) {
                if(list[game].key === this.state.gameCode) {
                    localStorage['firebaseKey'] = game
                    
                    firebase.database().ref('/games/' + game +'/players').push({
                        playerID: list[game].players.length
                    })
                }
            } 
        })
    }

    getData() {

        firebase.database().ref('/games').once('value')
        .then(snap => {
            const list = snap.val()
            let arr = []
            for(const game in list) 
                arr.push(list[game])

            this.setState({
                games: arr,
            })
        })

    }

    makeNewGame() {
            let code = this.generateCode()
            while(!this.checkCode(code)) code = this.generateCode()

            firebase.database().ref('/games').push({
                key: code,
                players: [
                    {
                        playerID: 0,
                        responses: []
                    }
                ]
            }).then(() => {
                this.setState({
                    gameCode: code,
                    host: true,
                    playerId: 0
                })
                localStorage['gameCode'] = code
                localStorage['timeStamp'] = new Date().toJSON()
            })

    }

    makeBody() {
        if(this.state.host) {
            return (
            <div className="page-content center-up">
                <h2>Game Code: {this.state.gameCode} </h2>
                <div>Just wait a moment while your friends join</div>
                <div style={{padding: '16px 0'}}>Number of players: {this.state.players.length}</div>
                <button>Start Game</button>
            </div>
            )

        }
        return (
            <div className="page-content center-up">
                <Input val={this.state.gameCode} field={'gameCode'} onUpdate={this.handleUpdate} label='Game Code' ></Input>
                <div style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                    <button style={{marginTop: '8px'}} className="inverse-button" onClick={this.joinGame()} >Join</button>
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