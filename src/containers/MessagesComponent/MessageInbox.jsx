import React, { Fragment } from 'react'
import Header from '../components/Header'
import {Row, Col} from 'react-bootstrap'
import moment from 'moment'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { CircularProgress } from '@material-ui/core'

class MessageRow extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            messages: null
        }
        this.path = `ws://127.0.0.1:8000/ws/chat/vineet/${props.room.consumer}`
        this.ws = new ReconnectingWebSocket(this.path)
    }
    componentDidMount(){
        this.ws.onopen = () => {
            console.log('connected', this.props.room.consumer)
            this.ws.send(JSON.stringify({command:'fetch_messages'}))
        }
        this.ws.onmessage = (e) => {
            const data = JSON.parse(e.data)
            if(data.command === 'messages'){
                this.setState({
                    messages: data.messages
                }, () => console.log(this.props.room.consumer,this.state))
            }else if(data.command === 'new_message'){
                console.log(data)
                this.setState(prevState => ({
                    messages: [...prevState.messages, data.message]
                }))
                this.props.newMessage(data.message.room, data.message)
            }
        }
        this.ws.onclose = () => {
            console.log('disconnected')
            // automatically try to reconnect on connection loss
        }
        this.ws.onerror = (err) => {
            console.log(err)
        }
    }
    render(){
        return (
            <Row className='py-3 inbox-card' onClick={() => this.props.openMessageBox(this.props.room, this.state.messages, this.ws)} style={{borderBottom: '1px solid grey'}}>
                <Col>
                    <span>{this.props.room.consumer}</span>
                    <br/>
                    {this.state.messages ?
                        <>
                        <span className='small muted mt-3'>{this.state.messages.length > 0 ? this.state.messages[this.state.messages.length - 1].content : null}</span>
                        <br />
                        <span className='smaller muted'>{this.state.messages.length > 0 ? moment(this.state.messages[this.state.messages.length - 1].created).format('DD/MM/YYYY hh:mm a') : null}</span>
                        </>
                    : <CircularProgress color='primary' />}
                </Col>
            </Row>
        )
    }
}

export const MessageInbox = (props) => {
    const list = props.rooms.map((item, ind) => <MessageRow newMessage={props.newMessage} openMessageBox={props.openMessageBox} key={ind} room={item} />)
    return (
        <Fragment>
            <Header title='LiveChat' />
            <Row>
                <div style={{width: '100%'}}>
                    {list}
                </div>
            </Row>
        </Fragment>
    )
}

export default MessageInbox
