import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import { TextField, FormControl, Button, Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Chatbox from './Chatbox'
import * as actions from '../../redux/actions'
import Navbar from '../components/Navbar'
import CustomizedSnackbar from '../components/CustomizedSnackbar'
export class LandingPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            chatbotName:  'Chatbot',
            headerBackgroundColor:  '#343a40',
            headerTextColor:  '#ffffff',
            introductionText: 'Introduction Text',
            introductionBackgroundColor: '#ffffff',
            introductionTextColor : '#000000',
            receiverBackground: '#eeeeee',
            senderBackground: '#eeeeee',
            receiverTextColor: '#000000',
            senderTextColor: '#000000',
            bot_picture : undefined,
            background_color: '#ffffff',
            inputBarBackground: '#ffffff',
            inputTextColor: '#000000',
            loading: true,
            getScript: false, 
            snackbar: {
                open: false,
                severity: null,
                message: null
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.openSnackbar = this.openSnackbar.bind(this)
        this.closeSnackbar = this.closeSnackbar.bind(this)
    }
    componentDidMount(){
        this.props.getChatbotDetails()
    }
    componentDidUpdate(){
        if(this.state.loading && this.props.styles && this.props.styles !== this.state){
            this.setState({
                ...this.props.styles,
                loading: false
            })
        }
    }
    handleChange(e){
        if(e.target.name === 'bot_picture'){     
            if(e.target.files && e.target.files.length>0){
                this.setState({
                    [e.target.name]: e.target.files[0]
                })
            }
            
        }else{
            const {name, value} = e.target;
            this.setState({
                [name]: value
            })
        }
    }
    handleSubmit(e){
        e.preventDefault()
        const formData = new FormData()
        let key;
        for(key in this.state){
            if(this.state[key]){
                console.log(key, this.state[key])
                if(key === 'bot_picture'){
                    if(typeof(this.state[key]) === 'object'){
                        formData.append(key, this.state[key], this.state[key].name)
                    }
                }else{
                    formData.append(key, this.state[key])
                }
            }
        }
        this.props.sendChatbotDetails(formData)
    }
    openSnackbar(e){
        this.setState({
            snackbar:{
                open:true,
                severity: 'error',
                message: 'Save the chatbot details first'
            }
        })
    }
    closeSnackbar(e, reason){
        if(reason === 'clickaway'){
            return
        }else{
            this.setState({
                snackbar:{
                    open:false,
                    severity:null,
                    message:null
                }
            })
        }
    }
    render() {
        return (
            <div className='parent'>
                <Navbar />
                <Row>
                    <Col className='col-8 p-3'>
                        <h1>Customize your Chatbot!</h1>
                        <h3>Chatbot's Details</h3>
                        <form onSubmit={this.handleSubmit}>
                            <Row className='center-row-between py-2'>
                                <Col className='float col-5'> 
                                    <FormControl fullWidth >
                                        <TextField
                                            name='chatbotName'
                                            variant='outlined'
                                            label="Chatbot's Name"
                                            value= {this.state.chatbotName}
                                            onChange={this.handleChange}
                                            color='primary'
                                            fullWidth
                                            required
                                        />
                                    </FormControl>
                                </Col>
                                <Col className='float col-3'>
                                    <FormControl fullWidth>
                                        <TextField
                                            required={true}
                                            variant='outlined'
                                            label='Header Color'
                                            name='headerBackgroundColor'
                                            value={this.state.headerBackgroundColor}
                                            onChange={this.handleChange}
                                            color='primary'
                                            fullWidth
                                        />
                                    </FormControl>
                                </Col>
                                <Col className='float col-3'>
                                    <FormControl fullWidth>
                                        <TextField
                                            required={true}
                                            variant='outlined'
                                            label='Header Text Color'
                                            name='headerTextColor'
                                            value={this.state.headerTextColor}
                                            onChange={this.handleChange}
                                            color='primary'
                                            fullWidth
                                        />
                                    </FormControl>
                                </Col>
                            </Row>

                            <h3>Introduction Text Details</h3>
                            <Row className='py-2 center-row-between'>
                                <Col className='float col-5'>
                                    <FormControl fullWidth>
                                        <TextField
                                            required={true}
                                            variant='outlined'
                                            label='Introduction Text'
                                            name='introductionText'
                                            value={this.state.introductionText}
                                            onChange={this.handleChange}
                                            color='primary'
                                            fullWidth
                                        />
                                    </FormControl>
                                </Col>
                                <Col className='float col-3'>
                                    <FormControl fullWidth>
                                        <TextField
                                            required={true}
                                            variant='outlined'
                                            label='Background Color'
                                            name='introductionBackgroundColor'
                                            value={this.state.introductionBackgroundColor}
                                            onChange={this.handleChange}
                                            color='primary'
                                            fullWidth
                                        />
                                    </FormControl>
                                </Col>
                                <Col className='float col-3'>
                                    <FormControl fullWidth>
                                        <TextField
                                            required={true}
                                            variant='outlined'
                                            label='Header Text Color'
                                            name='introductionTextColor'
                                            value={this.state.introductionTextColor}
                                            onChange={this.handleChange}
                                            color='primary'
                                            fullWidth
                                        />
                                    </FormControl>
                                </Col>
                            </Row>
                            <h3>Messages</h3>
                            <Row className='py-2 center-row-between'>
                                <Col className='float col-3'>
                                    <FormControl fullWidth>
                                        <TextField
                                            required={true}
                                            variant='outlined'
                                            label="Reciever Background"
                                            name='receiverBackground'
                                            value={this.state.receiverBackground}
                                            onChange={this.handleChange}
                                            color='primary'
                                            fullWidth
                                        />
                                    </FormControl>
                                </Col>
                                <Col className='float col-2'>
                                    <FormControl fullWidth>
                                        <TextField
                                            required={true}
                                            variant='outlined'
                                            label="Reciever Text"
                                            name='receiverTextColor'
                                            value={this.state.receiverTextColor}
                                            onChange={this.handleChange}
                                            color='primary'
                                            fullWidth
                                        />
                                    </FormControl>
                                </Col>
                                <Col className='float col-3'>
                                    <FormControl fullWidth>
                                        <TextField
                                            required={true}
                                            variant='outlined'
                                            label="Sender Background"
                                            name='senderBackground'
                                            value={this.state.senderBackground}
                                            onChange={this.handleChange}
                                            color='primary'
                                            fullWidth
                                        />
                                    </FormControl>
                                </Col>
                                <Col className='float col-2'>
                                    <FormControl fullWidth>
                                        <TextField
                                            required={true}
                                            variant='outlined'
                                            label="Sender Text"
                                            name='senderTextColor'
                                            value={this.state.senderTextColor}
                                            onChange={this.handleChange}
                                            color='primary'
                                            fullWidth
                                        />
                                    </FormControl>
                                </Col>
                            </Row>
                            <Row className='py-2 center-row-between mt-2'>
                                <Col className='float col-2'>
                                    <FormControl fullWidth>
                                        <label htmlFor='bot_picture' className='center-col-center small text-center'>
                                            <span>Profile Picture</span>
                                            <AddCircleIcon color='primary' className='add-icon mt-2 pointer' />
                                        </label>
                                        <input
                                            type='file'
                                            id='bot_picture'
                                            accept='image/*'
                                            name='bot_picture'
                                            onChange={this.handleChange}
                                            style={{
                                                display:'none'
                                            }}
                                        />
                                    </FormControl>
                                </Col>
                                <Col className='float col-2'>
                                    <FormControl fullWidth>
                                        <TextField
                                            required={true}
                                            variant='outlined'
                                            label="Background Color"
                                            name='background_color'
                                            value={this.state.background_color}
                                            onChange={this.handleChange}
                                            color='primary'
                                            fullWidth
                                        />
                                    </FormControl>
                                </Col>
                                <Col className='float col-3'>
                                    <FormControl fullWidth>
                                        <TextField
                                            required={true}
                                            variant='outlined'
                                            label="Input Bar BG"
                                            name='inputBarBackground'
                                            value={this.state.inputBarBackground}
                                            onChange={this.handleChange}
                                            color='primary'
                                            fullWidth
                                        />
                                    </FormControl>
                                </Col>
                                <Col className='float col-3'>
                                    <FormControl fullWidth>
                                        <TextField
                                            required={true}
                                            variant='outlined'
                                            label="Input Text Color"
                                            name='inputTextColor'
                                            value={this.state.inputTextColor}
                                            onChange={this.handleChange}
                                            color='primary'
                                            fullWidth
                                        />
                                    </FormControl>
                                </Col>
                            </Row>
                            <Row className='mt-4 center-row-space-between'>
                                <Button type='submit' color='primary' className='mt-3' variant='contained'>Submit</Button>
                                <Button variant='outlined' color='secondary' className='mt-3 ml-auto' onClick={this.props.styles ? ()=>this.setState({getScript:true}) : this.openSnackbar}>Get your script</Button>
                            </Row>
                            <div>{this.props.message}</div>
                        </form>
                    </Col>
                    <Col className='col-4'>
                        <Chatbox styles={this.state} />
                    </Col>
                </Row>
                <Dialog
                    open={this.state.getScript}
                    onClose={()=> this.setState({getScript : false})}
                >
                    <DialogTitle>
                        Add this script to the end of your html file
                    </DialogTitle>
                    <DialogContent>
                        {`<script async id='liveChat' user-name=${this.props.userDetails.user.username} src='http://localhost:8000/media/script/script.js'></script>`}
                    </DialogContent>
                </Dialog>
                <CustomizedSnackbar open={this.state.snackbar.open} handleClose={this.closeSnackbar} severity={this.state.snackbar.severity} message={this.state.snackbar.message} />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    styles: state.chatbot.chatbotDetails,
    message: state.chatbot.message,
    userDetails: state.auth.userDetails
})
const mapDispatchToProps = (dispatch) => ({
    getChatbotDetails : () => dispatch(actions.getChatbotDetails()),
    sendChatbotDetails: (payload) => dispatch(actions.sendChatbotDetails(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage)
