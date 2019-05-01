import React, { Component } from 'react';
import './style.css'

class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    handleInput(val) {
        this.props.onUpdate(val, this.props.field)
    }

    render() { 
        return ( 
            <div className="styled-input" >
                <input onChange={(e) => this.handleInput(e.target.value, this.props.field)} value={this.props.val} ></input>
                <span>{this.props.label}</span>
            </div>
         );
    }
}
 
export default Input;