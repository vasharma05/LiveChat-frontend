import React from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, DialogContentText, TextField, Button } from '@material-ui/core'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'
import axios from 'axios'
import './Consumer.css'
import { withRouter } from 'react-router-dom'
import MessageBox from './MessageBox'

function ConsumerBox(props){
    const user = props.match.params.user  
    const [chatConsumer, setChatConsumer] = React.useState(window.localStorage.getItem('chatConsumer'))
    const [email, setEmail] = React.useState('')
    const [chatbot, setChatbotDetails] = React.useState(null)
    console.log(chatbot)
    const handleEmailSubmit = (e) => {
        e.preventDefault()
        setChatConsumer(email.substring(0, email.indexOf('@')))
        window.localStorage.setItem('chatConsumer', email.substring(0, email.indexOf('@')))
    }
    React.useEffect(()=>{
        axios.post('http://localhost:8000/chatbot/details/',{username:user})
        .then(res => {
            if(res.data.detail === 'success'){
                setChatbotDetails(res.data.chatbot)
            }
        })
        .catch(error => console.log(error))
    }, [user])
    
    if(window.localStorage.getItem('chatConsumer') === null){
        if(props.consumer){
            window.localStorage.setItem('chatConsumer', props.consumer)
            setChatConsumer(props.consumer)
        }
    }
    const getEmail = (
        <Dialog
            open = {true}
        >
            <DialogTitle>
                <Typography
                    variant='h6'
                >
                    Please Enter your Email
                </Typography>
            </DialogTitle>
            <DialogContent>
            <form onSubmit={handleEmailSubmit}>
                <DialogContentText>
                        <TextField 
                            type='email'
                            label='Email Address'
                            name='email'
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            fullWidth
                            required
                        />
                        <DialogActions>
                            <Button type='submit' color='primary' variant='outlined'>Submit</Button>
                        </DialogActions>
                </DialogContentText>
                </form>
            </DialogContent>
        </Dialog>
    )
    return (
        chatConsumer ? chatbot ? <MessageBox user = {user} chatbot={chatbot} consumer={chatConsumer} email={email} /> : <h1>Error Encountered</h1> : getEmail
    )
}

const mapStateToProps = (state) => ({
    consumer : state.chatbot.consumer
})
const mapDispatchToProps = (dispatch) =>({
    sendConsumerEmail : (payload) => dispatch(actions.sendConsumerEmail(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ConsumerBox))