import React, { Suspense, lazy} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import './App.css';
import { connect } from 'react-redux'
import { CircularProgress } from '@material-ui/core'


const SignInView = lazy(()=> import('./containers/SignInView/SignInView')) 
const SignupView = lazy(()=> import('./containers/SignupView'))
const LandingPage = lazy(()=> import('./containers/LandingPage')) 
const NetworkError = lazy(()=> import('./containers/NetworkError'))
const Messages = lazy(() => import('./containers/MessagesComponent'))

function App(props) {
  const { signinData, networkError } = props
  return (
    <Router>
      <Suspense fallback={<center className='mt-3'><CircularProgress color='primary' /></center>} >
        <Switch>
          {networkError && <Route path='/' component={NetworkError} />}
          {signinData && <Route exact path='/' component={LandingPage} />}
          {!signinData && <Route exact path='/signin' component={SignInView} />}
          {!signinData && <Route exact path='/signup' component={SignupView} />}
          {signinData && <Route exact path='/messages' component={Messages} />}
          {signinData ? 
            <Redirect to='/' />:
            <Redirect to='signin' />
          }
        </Switch>
      </Suspense>
    </Router>
  );
}
const mapStateToProps = (state)=> ({
  signinData: state.auth.signinData,
  networkError: state.auth.networkError
})
export default connect(mapStateToProps)(App);
