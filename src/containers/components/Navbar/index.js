import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { withRouter, Redirect } from 'react-router-dom'
import './navbar.css'

// eslint-disable-next-line no-extend-native
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
const Navbar = (props) => {
    const [redirect, setRedirect] = React.useState(false)
    const handleLogout = () => {
        console.log(props.history)
        window.localStorage.clear()
        setRedirect(true)
    }
    console.log(redirect)
    return ( 
        redirect ? <Redirect to='/signin' /> :
        <nav className="navbar navbar-expand-lg navbar-light bg-dark py-3">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <Link to='/'><h3>LiveChat</h3></Link>

            <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
                
                    {props.signinData ?
                        <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                            <li className="nav-item active ml-3">
                                <Link to='/messages' >Messages</Link>
                            </li>
                            <li className="nav-item ml-3">
                                <Link to='/' >{props.userDetails.user.username.capitalize()}</Link>
                            </li>
                            <li className="nav-item ml-3">
                                <Link to='/' onClick={handleLogout} >Logout</Link>
                            </li>
                        </ul>
                    : 
                        <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                            <li className="nav-item ml-3">
                                <Link to='/signin'>Sign In</Link>
                            </li>
                            <li className="nav-item ml-3">
                                <Link to='/signup'>Sign Up</Link>
                            </li>
                        </ul>
                    }
            </div>
        </nav>
    )
}

const mapStateToProps = (state) => ({
    signinData: state.auth.signinData, 
    userDetails: state.auth.userDetails
})
export default connect(mapStateToProps)(withRouter(Navbar))