import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { TextField, FormControl, Button, CircularProgress } from '@material-ui/core'
import Navbar from '../components/Navbar'
import * as actions from '../../redux/actions'
import CustomizedSnackbar from '../components/CustomizedSnackbar'


function ChangePassword(props){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [snackbar, setSnackbar] = useState({
        open:false,
        severity : null,
        message: null
    })
    if(props.message && !snackbar.open){
        setLoading(true)
        if(props.message === 'Password changed successfully'){
            setSnackbar({
                open: true,
                severity:'success',
                message: props.message
            })
        }else if(props.message === 'Incorrect username'){
            setSnackbar({
                open: true,
                severity:'error',
                message: props.message
            })
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        props.changePassword({
            username,
            password
        })
    }
    const closeSnackbar = (e, reason)=>{
        if(reason === 'clickaway') return
        setSnackbar({
            open:false,
            severity:null,
            message: null
        })
        props.resetMessage()
    }
    return (
        <>
            <Navbar />
            <Row className='mt-5 center-col-center'>
                <Col className='col-lg-3 col-md-5 col-10 box py-3'>
                    <Col><h2>Change Password</h2></Col>
                    <form onSubmit={handleSubmit}>
                        <Row className='mt-5'>
                            <Col>
                                <FormControl fullWidth>
                                    <TextField
                                        variant='outlined'
                                        label='Username'
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        fullWidth
                                        required
                                    />
                                </FormControl>
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col>
                                <FormControl fullWidth>
                                    <TextField
                                        type='password'
                                        variant='outlined'
                                        label='New Password'
                                        value={password}
                                        error={password !== confirmPassword}
                                        onChange={(e) => setPassword(e.target.value)}
                                        fullWidth
                                        required
                                    />
                                </FormControl>
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col>
                                <FormControl fullWidth>
                                    <TextField
                                        type='password'
                                        variant='outlined'
                                        label='Confirm Password'
                                        value={confirmPassword}
                                        error={password !== confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        fullWidth
                                        required
                                    />
                                </FormControl>
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col>
                                !loading ? <Button type='submit' variant='outlined' fullWidth color='primary' disabled={password !== confirmPassword} >Save</Button> : <center><CircularProgress color='primary' /></center>
                            </Col>
                        </Row>
                    </form>
                </Col>
            </Row>
            {snackbar.open && <CustomizedSnackbar open={snackbar.open} handleClose={closeSnackbar} severity={snackbar.severity} message={snackbar.message} />}
        </>
    )
}

const mapStateToProps = (state) => ({
    message: state.auth.message
})
const mapDispatchToProps = (dispatch) => ({
    changePassword : (payload) => dispatch(actions.changePassword(payload)),
    resetMessage: () => dispatch(actions.resetAuthMessage())
})
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChangePassword))
