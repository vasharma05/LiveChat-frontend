import React, { Component } from 'react'
import {Row, Col} from 'react-bootstrap'
import { FormControl, TextField, Input, InputLabel, Button, CircularProgress } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

export class SignupView extends Component {
    constructor(){
        super()
        this.state = {
            name: '',
            email: '',
            username: '',
            companyName: '',
            companyEmail: '',
            companyAddress: '',
            profile_pic: '',
            password: '',
            confirmPassword: '',
            passwordMismatch: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        }, ()=>{
            if(this.state.password !== this.state.confirmPassword){
                this.setState({
                    passwordMismatch: true
                })
            }else{
                this.setState({
                    passwordMismatch: false
                })
            }
        })
    }
    handleSubmit(e){
        e.preventDefault()
        console.log(this.state)
        this.props.signup(this.state)
    }
    render() {
        return (
            <div className='parent'>
                <Row className='header'>
                    <Col className='center-row-between'>
                        <span className='large'>Live Chat!</span>
                    </Col>
                </Row>
                <Row className='mt-5'>
                    <Col className='col-md-6 offset-md-3 box p-3'>
                    {this.props.authError ? <span style={{color: 'red'}}>{this.props.authError}</span>: null}
                        <form className='mt-4' onSubmit={this.handleSubmit}>
                            <h1>Sign Up</h1>
                            <Row className='mt-4'>
                                <Col>
                                    <FormControl fullWidth>
                                        <TextField
                                            variant='outlined'
                                            value={this.state.name}
                                            onChange={this.handleChange}
                                            name='name'
                                            label='Name'
                                            color='primary'
                                            required
                                        />
                                    </FormControl>
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col>
                                    <FormControl fullWidth>
                                        <TextField
                                            variant='outlined'
                                            type='email'
                                            value={this.state.email}
                                            onChange={this.handleChange}
                                            name='email'
                                            label='Email'
                                            color='primary'
                                            required
                                        />
                                    </FormControl>
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col>
                                    <FormControl fullWidth>
                                        <TextField
                                            variant='outlined'
                                            value={this.state.username}
                                            onChange={this.handleChange}
                                            name='username'
                                            label='Username'
                                            color='primary'
                                            required
                                        />
                                    </FormControl>
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col>
                                    <FormControl fullWidth>
                                        <InputLabel>Profile Picture</InputLabel>
                                        <Input
                                            variant='outlined'
                                            type='file'
                                            accept='image/*'
                                            value={this.state.profile_pic}
                                            onChange={this.handleChange}
                                            name='profile_pic'
                                            color='primary'
                                        />
                                    </FormControl>
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col>
                                    <FormControl fullWidth>
                                        <TextField
                                            variant='outlined'
                                            value={this.state.companyName}
                                            onChange={this.handleChange}
                                            name='companyName'
                                            label='Company Name'
                                            color='primary'
                                            required
                                        />
                                    </FormControl>
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col>
                                    <FormControl fullWidth>
                                        <TextField
                                            variant='outlined'
                                            type='email'
                                            value={this.state.companyEmail}
                                            onChange={this.handleChange}
                                            name='companyEmail'
                                            label='Company Email'
                                            color='primary'
                                            required
                                        />
                                    </FormControl>
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col>
                                    <FormControl fullWidth>
                                        <TextField
                                            variant='outlined'
                                            value={this.state.companyAddress}
                                            onChange={this.handleChange}
                                            name='companyAddress'
                                            label='Company Address'
                                            color='primary'
                                            required
                                        />
                                    </FormControl>
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col>
                                    <FormControl fullWidth>
                                        <TextField
                                            variant='outlined'
                                            type='password'
                                            value={this.state.password}
                                            onChange={this.handleChange}
                                            name='password'
                                            label='Password'
                                            color='primary'
                                            error={this.state.passwordMismatch}
                                            required
                                        />
                                    </FormControl>
                                </Col>
                            </Row>
                            <Row className='mt-3'>
                                <Col>
                                    <FormControl fullWidth>
                                        <TextField
                                            variant='outlined'
                                            type='password'
                                            value={this.state.confirmPassword}
                                            onChange={this.handleChange}
                                            name='confirmPassword'
                                            label='Confirm Password'
                                            color='primary'
                                            error={this.state.passwordMismatch}
                                            required
                                        />
                                    </FormControl>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col>
                                {this.props.authLoading ? <CircularProgress color='primary' /> : <Button className='mt-4' type='submit' variant='contained' color='primary' disabled={this.state.passwordMismatch}>Sign Up</Button>}

                                </Col>
                            </Row>
                        </form>
                        <Row className='mt-4'>
                            <Col>
                                <span className='ml-auto small'>Already an user? Sign in <Link to='/signin'>here</Link></span>
                            </Col>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    authError: state.auth.authError,
    signinData : state.auth.signinData,
    authLoading : state.auth.authLoading
})
const mapDispatchToProps = (dispatch)=>({
    signup : (payload) => dispatch(actions.signup(payload))
})
export default connect(mapStateToProps, mapDispatchToProps)(SignupView)
