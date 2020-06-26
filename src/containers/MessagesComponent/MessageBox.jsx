import React, { Fragment } from 'react'
import { Header } from '../components/Header'
import { Row, Col } from 'react-bootstrap'
import Button from '@material-ui/core/Button'
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import { CircularProgress } from '@material-ui/core';
import moment from 'moment'
import { connect } from 'react-redux'

export const Message = ({message}) => {
    return (
        <Row className={message.author === message.room.split(' ')[0] ? 'sent-text mt-2' : 'received-text mt-2'}>
            <div className='p-3'>
                <span>{ message.content }</span>
                <br/>
                <span className='ml-auto smaller'>{moment(message.created).format('LT')}</span>
            </div>
        </Row>
    )
}

class MessageBox extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            newMessage: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.messagesEndRef = React.createRef()
        this.scrollToBottom = this.scrollToBottom.bind(this)
    }
    scrollToBottom(){
        this.messagesEnd.scrollIntoView({ behavior: 'smooth' })
    }
    componentDidMount(){
        this.scrollToBottom()
    }
    componentDidUpdate(){
        this.scrollToBottom()
    }
    handleSubmit(){
        if(this.state.newMessage.trim().length > 0){
            this.props.ws.send(JSON.stringify({
                command:'new_message',
                message: {
                    author: this.props.user.username,
                    content: this.state.newMessage.trim()
                }
            }))
            this.setState({
                newMessage: ''
            })
        }
    }
    render(){
        const messages_list = this.props.messages ? this.props.messages.map((item, ind) => <Message key={ind} message={item} />) : null
        return (
            <Fragment>
                <Header title={this.props.room.consumer} />
                <Row className = 'py-3 messages-ctn'>
                    <Col className='col-end pb-2'>
                        {messages_list ? messages_list : <center><CircularProgress color='primary' /></center>}
                        <div ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </Col>
                </Row>
                    <Row className='center-row'>
                        <Col className='col-11'>
                            <input
                                className='text-input px-3'
                                name='text'
                                placeholder='Enter text'
                                value={this.state.newMessage}
                                onChange={(e) => this.setState({newMessage: e.target.value})}
                                onKeyDown={(e)=> e.keyCode === 13 ? this.handleSubmit() : null}
                            />
                        </Col>
                        <Col>
                            <Button onClick={this.handleSubmit}><SendRoundedIcon style={{fontSize: '40px', color: 'green'}} /></Button>
                        </Col>
                    </Row>
            </Fragment>
        )
    }
}
const mapStateToProps = (state) => ({
    user: state.auth.userDetails.user
})

export default connect(mapStateToProps)(MessageBox)
