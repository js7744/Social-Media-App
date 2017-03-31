import React, { Component } from 'react';
import cookie from 'react-cookie';
import { browserHistory } from 'react-router';

class Logout extends Component {
  render() {

    let c = cookie.load('userId');
    if(c > 0) {
      cookie.remove('userId', {path: '/'});
      browserHistory.push('/');
    }
    else {
      browserHistory.push('/');
    }
    return(
      <div></div>
      )
  }
}

export default Logout;
