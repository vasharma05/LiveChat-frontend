import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import SignInView from './components/SignInView/SignInView'
import SignupView from './components/SignupView'
import './App.css';
import { connect } from 'react-redux'

function App(props) {
  const { signinData } = props
  return (
    <Router>
      <Switch>
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
  signinData: state.auth.signinData
})
export default connect(mapStateToProps)(App);
