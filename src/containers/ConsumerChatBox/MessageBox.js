import React from 'react'
import { Dialog, DialogContent, DialogTitle, Button, CircularProgress, FormControl, ButtonBase } from '@material-ui/core'
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import ReconnectingWebsocket from 'reconnecting-websocket'
import {Row, Col, Image} from 'react-bootstrap'
import moment from 'moment'
import axios from 'axios'
import './Consumer.css'

const Message = ({message, chatbot}) => {
    return (
        <Row className={message.author === message.room.split(' ')[1] ? 'sent-text mt-2' : 'received-text mt-2'}>
            <div className='p-3' style={{backgroundColor : message.author === message.room.split(' ')[1] ? chatbot.senderBackground : chatbot.receiverBackground, color: message.author === message.room.split(' ')[1] ? chatbot.senderTextColor : chatbot.receiverTextColor }}>
                {message.type === 'text'?
                    <span>{ message.content }</span>
                : message.type === 'image/jpeg' || message.type === 'image/png' || message.type === 'image/svg+xml' ?
                    <Image width='100%' src={`http://localhost:8000${message.file}`} />
                : <span>{ message.file }</span>}
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
            newMessage: '',
            drawer: false,
            files: null,
            uploaded : 0,
            messages: [
                {
                    author:this.props.user,
                    type:'text',
                    content:'Hi! How can I help you?',
                    room: `${props.user} ${props.consumer}`
                }
            ]
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.messagesEndRef = React.createRef()
        this.scrollToBottom = this.scrollToBottom.bind(this)
        this.handleFileUpload = this.handleFileUpload.bind(this)
    }
    scrollToBottom(){
        this.messagesEnd.scrollIntoView({ behavior: 'smooth' })
    }
    componentDidMount(){
        this.scrollToBottom()
        let path = `ws://127.0.0.1:8000/ws/room/${this.props.user}`
        this.admin = new ReconnectingWebsocket(path)
        this.admin.onopen = () => {
            console.log('main connected')
            this.admin.send(JSON.stringify({
                command: 'room',
                consumer: this.props.consumer,
                email: this.props.email
            }))
        }
        this.admin.onclose = () => {
            console.log('main disconnected')
        }
        this.admin.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(data)
            if(data.command === 'new_room' || data.command === 'room_exists'){
                path = `ws://127.0.0.1:8000/ws/chat/${this.props.user}/${this.props.consumer}`
                this.ws = new ReconnectingWebsocket(path)
                this.ws.onopen = ()=>{
                    console.log('connected')
                    if(this.state.messages.length === 1){
                        this.ws.send(JSON.stringify({
                            command:'fetch_messages'
                        }))
                    }
                }
                this.ws.onmessage = (e) => {
                    const data = JSON.parse(e.data);
                    console.log(data)
                    if(data.command === 'messages'){
                        this.setState(prevState => ({
                            messages: [...prevState.messages, ...data.messages]
                        }))
                    }else if(data.command === 'new_message'){
                        this.setState(prevState => ({
                            messages: [...prevState.messages, data.message]
                        }))
                    }
                };
                this.ws.onclose = function(e) {
                    console.error('Chat socket closed unexpectedly');
                };      
            }
        };
    }
    componentDidUpdate(){
        this.scrollToBottom()
    }
    handleSubmit(){
        if(this.state.newMessage.trim().length > 0){
            this.ws.send(JSON.stringify({
                command:'new_message',
                message: {
                    author: this.props.consumer,
                    content: this.state.newMessage.trim(),
                    type:'text'
                }
            }))
            this.setState({
                newMessage: ''
            })
        }
    }
    handleFileUpload(e){
        let files = []
        for(let i=0;i<e.target.files.length; i++){
            files.push({
                id: i,
                file: e.target.files[i],
                progress: 0,
                uploaded: false
            })
        }
        this.setState({
            files: files,
            drawer: true
        })
    }
    handleCancel(){
        this.setState({
            files:null,
            drawer: false
        })
    }
    handleFileSubmit(e){
        this.state.files.forEach(el => {
            const config = {
                onUploadProgress: progressEvent => {
                    const {loaded,total} = progressEvent
                    let progress = parseInt(loaded/total)*100
                    let files = this.state.files
                    files.find(item => item.id === el.id).progress = progress
                    this.setState(prevState => ({
                        files,
                        uploaded: progress === 100 ? prevState.uploaded + 1 : prevState.uploaded
                    }))
                }
            }
            let form = new FormData()
            form.append('file',el.file, el.file.name)
            form.append('author',this.props.consumer)
            form.append('type', el.file.type)
            form.append('content', el.file.type)
            form.append('room', `${this.props.user} ${this.props.consumer}`)
            axios.post('http://localhost:8000/chatbot/message/file/upload/', form, config)
            .then(res => {
                return this.ws.send(JSON.stringify({
                command:'new_message',
                message: res.data
            }))})
            .catch(err => console.log(err))
        });
    }
    render(){
        const {chatbot} = this.props
        const messages_list = this.state.messages.length > 0 ? this.state.messages.map((item, ind) => <Message chatbot={chatbot} key={ind} message={item} />) : []
        if(this.state.uploaded && this.state.files){
            if(this.state.uploaded === this.state.files.length){
                this.setState({
                    drawer: false,
                    files: null,
                    uploaded: 0
                })
            }
        }
        
        return (
            <div className='message-box'>
                <Row className='center-row header' style={{backgroundColor: chatbot.headerBackgroundColor, color: chatbot.headerTextColor}}>
                    <div className='ml-2'>
                        <Image height='50px' roundedCircle src={chatbot.bot_picture ? chatbot.bot_picture : require('../../assets/images/chatbot.png')} />
                    </div>
                    <Col>
                        <span className='large'>{chatbot.chatbotName}</span>
                    </Col>
                </Row>
                <Row className='introductoryText' style={{backgroundColor: chatbot.introductionBackgroundColor, color: chatbot.introductionTextColor}}>
                    <Col className='center-col-center'>
                        <center>{chatbot.introductionText}</center>
                    </Col>
                </Row>
                <Row className = 'py-3 messages-ctn' style={{backgroundColor: chatbot.background_color}}>
                    <Col className='col-end pb-2'>
                        {messages_list ? messages_list : <center><CircularProgress color='primary' /></center>}
                        <div ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </Col>
                </Row>
                    <Row className='center-row input-bar'>
                        <Col>
                            <input
                                className='text-input px-3'
                                name='text'
                                placeholder='Enter text'
                                value={this.state.newMessage}
                                onChange={(e) => this.setState({newMessage: e.target.value})}
                                onKeyDown={(e)=> e.keyCode === 13 ? this.handleSubmit() : null}
                            />
                        </Col>
                        <div className='center-col-center' style={{height:'100%'}}>
                            <FormControl>
                                
                                    <ButtonBase>
                                        <label className='pointer pt-2' htmlFor='file_upload'>
                                        <AttachFileIcon style={{color: 'green', fontSize: '30px'}} />
                                        </label >
                                    </ButtonBase>
                                <input
                                    id='file_upload'
                                    multiple
                                    type='file'
                                    name='document'
                                    onChange={this.handleFileUpload}
                                    style={{
                                        display: 'none'
                                    }}
                                />
                            </FormControl>
                        </div>
                        <div className='center-col-center' style={{height:'100%'}}>
                            <Button style={{padding: 0, height:'100%'}} onClick={this.handleSubmit}><SendRoundedIcon style={{color: 'green', fontSize: '30px'}} /></Button>
                        </div>
                    </Row>
                    <Dialog
                        open={this.state.drawer && this.state.files.length > 0}
                        fullWidth
                    >
                        <DialogTitle>Upload File</DialogTitle>
                        <DialogContent>
                            <Row>
                                <Col>
                                    <b>File Name</b>
                                </Col>
                                <Col>
                                    <b>File Type</b>
                                </Col>
                                <Col className='center-col-center'>
                                    <b>Progress</b>
                                </Col>
                            </Row>
                            {this.state.files ? this.state.files.map((item, ind) => <Row className='mt-2' key={ind}><Col>{item.file.name}</Col><Col>{item.file.type}</Col><Col className='center-col-center'><CircularProgress variant='static' value={item.progress} /></Col></Row>):null}
                            <Row className='mt-3'>
                                <Col className='center-col-center'>
                                    <Button variant='outlined' onClick={this.handleCancel.bind(this)} >Cancel</Button>
                                </Col>
                                <Col className='center-col-center'>
                                    <Button variant='contained' color='primary' onClick={this.handleFileSubmit.bind(this)}>Upload</Button>
                                </Col>
                            </Row>
                        </DialogContent>
                    </Dialog>
            </div >
        )
    }
}

export default MessageBox