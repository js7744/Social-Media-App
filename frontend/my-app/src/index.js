import React from 'react';
import ReactDOM from 'react-dom';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';
import App from './components/App';
import Login from './components/login';
import Register from './components/register';
import Cover from './components/cover';
import Home from './components/home';
import EditProfile from './components/editprofile';
import Profile from './components/profile';
import './assets/css/index.css';

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App} >
      <IndexRoute path="/cover" component={Cover} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Route>
    <Route path="/home/:id" components={Home} />
    <Route path="/profile/:id" components={Profile} />
    <Route path="/editprofile/:id" components={EditProfile} />
  </Router>
), document.getElementById('root'))

