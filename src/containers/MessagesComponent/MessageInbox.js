import React, { Fragment } from 'react'
import {Row, Col} from 'react-bootstrap'
import moment from 'moment'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { CircularProgress } from '@material-ui/core'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import CameraAltIcon from '@material-ui/icons/CameraAlt';

class MessageRow extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            messages: null,
            bold: false
        }
        this.path = `ws://127.0.0.1:8000/ws/chat/${props.userDetails.user.username}/${props.room.consumer}`
        console.log(this.path)
        this.ws = new ReconnectingWebSocket(this.path)
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(){
        this.props.openMessageBox(this.props.room, this.state.messages, this.ws); 
        this.setState({
            bold: false
        })
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
                let res = this.props.newMessage(data.message.room, data.message)
                console.log(res)
                if(res){
                    this.setState({
                        bold: false
                    })
                }else{
                    this.setState({
                        bold: true
                    })
                }
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
    componentWillUnmount(){
        this.ws.close()
    }
    render(){
        return (
            this.state.messages ? this.state.messages.length > 0 ?
            <Row className='py-3 inbox-card' onClick={this.handleClick} style={{borderBottom: '1px solid grey'}}>
                <Col>
                    <span>{this.props.room.consumer}</span>
                    <br/>
                    {this.state.messages ?
                        <>
                        <span className='small muted mt-3' style={{fontWeight: this.state.bold ? 'bold' : 'normal'}}>{this.state.messages.length > 0 ? this.state.messages[this.state.messages.length - 1].type === 'text' ? this.state.messages[this.state.messages.length - 1].content : this.state.messages[this.state.messages.length - 1].type === 'image/jpeg' || this.state.messages[this.state.messages.length - 1].type === 'image/png' || this.state.messages[this.state.messages.length - 1].type === 'image/svg+xml' ? <CameraAltIcon style={{color: 'black'}} />  : 'File' : null}</span>
                        <br />
                        <span className='smaller muted'>{this.state.messages.length > 0 ? moment(this.state.messages[this.state.messages.length - 1].created).format('DD/MM/YYYY hh:mm a') : null}</span>
                        </>
                    : <CircularProgress color='primary' />}
                </Col>
            </Row> : null : null
        )
    }
}

const MessageInbox = (props) => {
    console.log(props)
    const list = props.rooms.map((item, ind) => <MessageRow userDetails={props.userDetails} newMessage={props.newMessage} openMessageBox={props.openMessageBox} key={ind} room={item} />)
    return (
        <Fragment>
            <Row className='center-row header'>
                <Col>
                    <span className='large'>LiveChat</span>
                </Col>
            </Row>
            <Row className='inbox-ctn'>
                <div style={{width: '100%'}}>
                    {list}
                </div>
            </Row>
        </Fragment>
    )
}

const mapStateToProps = (state) => ({
    userDetails: state.auth.userDetails
})

export default connect(mapStateToProps)(withRouter(MessageInbox))
