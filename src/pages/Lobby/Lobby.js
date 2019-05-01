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

    checkCode(code, arr) {
        arr.forEach(game => {
            if(game.key === code) return false
        })

        return true
    }

    getData() {
        firebase.database().ref('/games').once('value')
        .then(snap => {
            const list = snap.val()
            let arr = []
            for(const game in list) 
                arr.push(list[game])

            let code = this.generateCode()
            while(!this.checkCode(code, arr)) code = this.generateCode()

            if(!localStorage['gameCode']) {
                firebase.database().ref('/games').push({
                    key: code,
                    players: []
                })
            }
            else {
                const NOW = new Date()
                const old = new Date(localStorage['timeStamp'])
                const diff = NOW - old
                const TENMINS = 1000 * 60 * 10

                if(diff > TENMINS) console.log('old')
                else  { 
                    console.log('fine')
                    code = localStorage['gameCode']
                }
            }

            this.setState({
                games: arr,
                gameCode: code,
                host: true,
            })
            localStorage['gameCode'] = code
            localStorage['timeStamp'] = new Date().toJSON()
        })
    }

    componentDidMount() {
        const temp = queryString.parse(window.location.search)
      
      if(temp.host)      
        this.getData()
    }

    handleUpdate(value, field) {
        this.setState({
            [field]: value
        })
    }

    joinGame() {
        firebase.database().ref()
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