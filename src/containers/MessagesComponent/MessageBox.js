import React, { Fragment } from 'react'
import { Row, Col, Image } from 'react-bootstrap'
import Button from '@material-ui/core/Button'
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import { CircularProgress, FormControl, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import moment from 'moment'
import { connect } from 'react-redux'
import AttachFileIcon from '@material-ui/icons/AttachFile';
import ButtonBase from '@material-ui/core/ButtonBase';
import axios from 'axios'

const Message = ({message}) => {
    return (
        <Row className={message.author === message.room.split(' ')[0] ? 'sent-text mt-2' : 'received-text mt-2'}>
            <div className='p-3'>
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
            files: null
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
        // console.log(e.target.files)
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
        }, ()=> console.log(this.state.files))
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
                    console.log(progressEvent)
                    const {loaded,total} = progressEvent
                    let progress = parseInt(loaded/total)*100
                    let files = this.state.files
                    files.find(item => item.id === el.id).progress = progress
                    this.setState(prevState => ({
                        files
                    }), ()=>console.log(this.state.files))
                }
            }
            let form = new FormData()
            form.append('file',el.file, el.file.name)
            form.append('author',this.props.user.username)
            form.append('type', el.file.type)
            form.append('content', el.file.type)
            form.append('room', `${this.props.user.username} ${this.props.room.consumer}`)
            axios.post('http://localhost:8000/chatbot/message/file/upload/', form, config)
            .then(res => {
                console.log(res.data)
                return this.props.ws.send(JSON.stringify({
                command:'new_message',
                message: res.data
            }))})
            .catch(err => console.log(err))
        });
        console.log(this.state.files)
    }
    render(){
        console.log(this.state.files)
        const messages_list = this.props.messages ? this.props.messages.map((item, ind) => <Message key={ind} message={item} />) : null
        return (
            <Fragment>
                <Row className='center-row header'>
                    <Col>
                        <span className='large'>{this.props.room.consumer.capitalize()}</span>
                    </Col>
                </Row>
                <Row className = 'py-3 messages-ctn'>
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
                                <Col>
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
            </Fragment>
        )
    }
}
const mapStateToProps = (state) => ({
    user: state.auth.userDetails.user
})

export default connect(mapStateToProps)(MessageBox)
