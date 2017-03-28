import React, { Component } from 'react';
import axios from 'axios';
import '../assets/css/login.css';
import {browserHistory} from 'react-router'
import cookie from 'react-cookie';

class Login extends Component {
  constructor(props){
    super(props);
    this.state={
      email: '',
      password:'',
      data: '',
      errors: {},
      }
      this.onFieldChange = this.onFieldChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }


  onFieldChange(event){
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(e){
    axios.post('http://localhost:8000/login', {
      userdata: this.state,
    })

    .then(function (response) {
      cookie.save(response.data.id, 'user_Id:' + response.data.id, { path: '/'});
      if(response.data.id){
        browserHistory.push("/home/" + response.data.id )
      } else {
        browserHistory.push("/login")
      }

    })
    .catch(function (error) {
      console.log(error);

    });
    e.preventDefault(e);

  }

  render() {
    return (
      <div className="content">
        <form className="loginform">
          <header>Login Here !!</header>

          <label>Email Id</label>
          <input type="text"
            name="email"
            minLength="3"
            placeholder="abc@gmail.com"
            value={this.state.email}
            onChange={this.onFieldChange} required />
          <div className="help">At least 4 character</div>

          <label>Password</label>
          <input type="password"
            name="password"
            placeholder="*********"
            maxLength="12"
            value={this.state.password}
            onChange={this.onFieldChange} />
            <div className="help">Use upper and lowercase lettes as well</div>
          <button onClick={this.handleSubmit}>Login</button>
        </form>
      </div>
    );
  }
}

export default Login;
