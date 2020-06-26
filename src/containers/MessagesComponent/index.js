import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import { MessageInbox } from './MessageInbox'
import  MessageBox  from './MessageBox'
import { connect } from 'react-redux'
import './Messages.css'
import { CircularProgress } from '@material-ui/core'
import ReconnectingWebSocket from 'reconnecting-websocket'

export class Messages extends Component {
    constructor(props){
        super(props)
        let path = `ws://127.0.0.1:8000/ws/room/${props.user.username}`
        this.state = {
            rooms: null,
            messageBox: null,
            messages: null,
            ws: null
        }
        this.ws = new ReconnectingWebSocket(path)
        this.openMessageBox = this.openMessageBox.bind(this)
        this.newMessage = this.newMessage.bind(this)
    }
    componentDidMount(){
        this.ws.onopen = () => {
            console.log('connected main')
        }
        this.ws.onmessage = (e) => {
            const message = JSON.parse(e.data)
            this.setState({
                rooms: message
            })
        }
        this.ws.onclose = () => {
            console.log('disconnected main')
            // automatically try to reconnect on connection loss
        }
        this.ws.onerror = (err) => {
            console.error(err)
        }
    }
    newMessage(room, message){
        if(room.split(' ')[1] === this.state.messageBox.consumer){
            this.setState(prevState => ({
                messages: [...prevState.messages, message]
            }))
        }
    }
    openMessageBox(room, messages, ws){
        this.setState({
            messageBox: room,
            messages: messages,
            ws: ws
        })
    }
    render() {
        return (
             this.state.rooms ? 
            <Row className='parent'>
                <Col className='col-10 offset-1'>
                    <Row style={{height: '90vh', marginTop: '5vh', overflow:'hidden'}}>
                        <Col className='col-3 message-inbox'>
                            <MessageInbox openMessageBox={this.openMessageBox} newMessage={this.newMessage} rooms={this.state.rooms} />
                        </Col>
                        <Col className='col-9 message-box' style={{height: '100%'}}>
                            {this.state.messageBox ?  <MessageBox room={this.state.messageBox} messages={this.state.messages} ws={this.state.ws} /> : null}
                        </Col>
                    </Row>
                </Col>
            </Row>: <center className='mt-5'><CircularProgress color='primary' /></center>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.userDetails.user
})

export default connect(mapStateToProps)(Messages)
