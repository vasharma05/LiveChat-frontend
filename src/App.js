import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import SignInView from './components/SignInView/SignInView'
import SignupView from './components/SignupView'
import LandingPage from './components/LandingPage'
import NetworkError from './components/NetworkError'
import './App.css';
import { connect } from 'react-redux'

function App(props) {
  const { signinData, networkError } = props
  return (
    <Router>
      <Switch>
        {networkError && <Route path='/' component={NetworkError} />}
        {signinData && <Route exact path='/' component={LandingPage} />}
        {!signinData && <Route exact path='/signin' component={SignInView} />}
        {!signinData && <Route exact path='/signup' component={SignupView} />}
        {signinData ? 
          <Redirect to='/' />:
          <Redirect to='signin' />
        }
      </Switch>
    </Router>
  );
}
const mapStateToProps = (state)=> ({
  signinData: state.auth.signinData,
  networkError: state.auth.networkError
})
export default connect(mapStateToProps)(App);
