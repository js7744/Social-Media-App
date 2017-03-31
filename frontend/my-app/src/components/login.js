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
      errorEmail:'',
      errorPassword:'',
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
    let self = this
    axios.post('http://localhost:8000/login', {
      userdata: this.state,
    })

    .then(function (response) {

      if(response.data.data){
        const er = response.data.data;
        console.log(response.data.data)
        er.map(function(item) {
          if(item.param === "userdata.email") {
            self.setState({ errorEmail: item.msg });
          }
          if(item.param === "userdata.password") {
            self.setState({ errorPassword: item.msg });
          }
        });
      } else {
        let userId = response.data.id;
        console.log("--->>>>>", userId)
        cookie.save(userId, userId);
        browserHistory.push("/home/" + userId);
      }
    })


    .catch(function (error) {
      console.log(error);

    });
    e.preventDefault(e);

  }

  render() {
    var erroremail = '', errorpass = '';
    if(this.state.errorEmail) {
      erroremail = this.state.errorEmail;
    }

    if(this.state.errorPassword) {
      errorpass = this.state.errorPassword;
    }

    return (
      <div className="content">
        <form className="loginform">
          <header>Login Here !!</header>

          <label>Email Id</label>
          <input
            type="text"
            name="email"
            minLength="3"
            placeholder="abc@gmail.com"
            value={this.state.email}
            onChange={this.onFieldChange} required />
          <div className="help">{erroremail}</div>

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="*********"
            maxLength="12"
            value={this.state.password}
            onChange={this.onFieldChange} />
            <div className="help">{errorpass}</div>

          <button onClick={this.handleSubmit}>Login</button>
        </form>
      </div>
    );
  }
}

export default Login;
