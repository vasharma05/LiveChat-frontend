import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import SignInView from './components/SignInView/SignInView'
import SignupView from './components/SignupView'
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/signin' component={SignInView} />
        <Route exact path='/signup' component={SignupView} />
      </Switch>
    </Router>
  );
}

export default App;
