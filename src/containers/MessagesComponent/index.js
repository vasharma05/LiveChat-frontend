import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import  MessageInbox  from './MessageInbox'
import  MessageBox  from './MessageBox'
import { connect } from 'react-redux'
import './Messages.css'
import { CircularProgress } from '@material-ui/core'
import ReconnectingWebSocket from 'reconnecting-websocket'
import Navbar from '../components/Navbar'
import CustomizedSnackbar from '../components/CustomizedSnackbar'

export class Messages extends Component {
    constructor(props){
        super(props)
        let path = `ws://127.0.0.1:8000/ws/room/${props.user.username}`
        this.state = {
            rooms: null,
            messageBox: null,
            messages: null,
            ws: null,
            snackbar:{
                open: false,
                message: null,
                severity: null
            }
        }
        this.ws = new ReconnectingWebSocket(path)
        this.openMessageBox = this.openMessageBox.bind(this)
        this.newMessage = this.newMessage.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }
    componentDidMount(){
        // eslint-disable-next-line no-extend-native
        String.prototype.capitalize = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }
        this.ws.onopen = () => {
            console.log('connected main')
            this.setState({
                snackbar: {
                    open: true,
                    message: 'Connected',
                    severity: 'success'
                }
            })
            this.ws.send(JSON.stringify({
                'command': 'fetch_rooms',
            }))
        }
        this.ws.onmessage = (e) => {
            const data = JSON.parse(e.data)
            console.log(data)
            if(data.command === 'rooms'){
                this.setState({
                    rooms: data.rooms
                })
            }else if(data.command === 'new_room'){
                this.setState(prevState => ({
                    rooms: [...prevState.rooms, data.room]
                }))
            }
        }
        this.ws.onclose = () => {
            console.log('disconnected main')
            this.setState({
                snackbar: {
                    open: true,
                    message: 'Disconnected',
                    severity: 'error'
                }
            })
            // automatically try to reconnect on connection loss
        }
        this.ws.onerror = (err) => {
            console.error(err)
        }
    }
    componentWillUnmount(){
        this.ws.close()
    }
    newMessage(room, message){
        if(this.state.messageBox){
            if(room.split(' ')[1] === this.state.messageBox.consumer){
                if(this.state.messages){
                    this.setState(prevState => ({
                        messages:  [...prevState.messages, message]
                    }))
                }else{
                    this.setState({
                        messages : [message]
                    })
                }
                return 1
            }
        }
        return 0
    }
    openMessageBox(room, messages, ws){
        this.setState({
            messageBox: room,
            messages: messages,
            ws: ws
        })
    }
    handleClose(e,reason){
        if(reason === 'clickaway'){
            return
        }
        this.setState({
            snackbar: {
                open: false,
                message: null,
                severity: null
            }
        })
    }
    render() {
        return (
             this.state.rooms ? 
            <>
                <Navbar />
                <Row className='body'>
                    <Col className='col-lg-10 offset-lg-1 col'>
                        <Row className='message' style={{height: '90vh', marginTop: '2.5vh', overflow:'hidden'}}>
                            <Col className='col-3 message-inbox'>
                                <MessageInbox openMessageBox={this.openMessageBox} newMessage={this.newMessage} rooms={this.state.rooms} />
                            </Col>
                            <Col className='col-9 message-box' style={{height: '100%'}}>
                                {this.state.messageBox ?  <MessageBox room={this.state.messageBox} messages={this.state.messages} ws={this.state.ws} /> : null}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {this.state.snackbar.open ? <CustomizedSnackbar open={this.state.snackbar.open} handleClose={this.handleClose} severity={this.state.snackbar.severity} message={this.state.snackbar.message} /> : null}
            </> : <center className='mt-5'><h3>Connecting </h3><CircularProgress color='primary' /></center>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.userDetails.user
})

export default connect(mapStateToProps)(Messages)
