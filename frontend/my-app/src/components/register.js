import React, { Component } from 'react';
import '../assets/css/register.css';
import axios from 'axios';

class Register extends Component {
  constructor(props){
    super(props);
    this.state={
      username: '',
      email: '',
      password:'',
      data: '',
      errors: {},
      errorUsername:'',
      errorEmail:'',
      errorPassword:'',
    }
    this.onFieldChange = this.onFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e){
    e.preventDefault();
    let self = this
    // console.log(this.state);
    // return false;
    axios.post('http://localhost:8000/register', {
      userdata: this.state,
    })

    .then(function (response) {
      if (response.data.data) {
        const er = response.data.data;
        console.log(response.data.data)
        er.map(function(item) {
          if(item.param === "userdata.username") {
            self.setState({ errorUsername: item.msg });
          }
          if(item.param === "userdata.email") {
            self.setState({ errorEmail: item.msg });
          }
          if(item.param === "userdata.password") {
            self.setState({ errorPassword: item.msg });
          }
        });
      } else {
        alert("Sucessfully Register")
        self.setState({
          username: '',
          email: '',
          password:'',
        })
      }
    })
    .catch(function (error) {
      console.log(error);
    });
    e.preventDefault(e);
  }

  onFieldChange(event){
    console.log(event.target)
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  render() {
    let erroruser = '', erroremail = '', errorpass = '';
    if(this.state.errorUsername) {
      erroruser = this.state.errorUsername;
    }
    if(this.state.errorEmail){
        erroremail = this.state.errorEmail;
    }
    if(this.state.errorPassword){
        errorpass = this.state.errorPassword;
    }

    return (
      <div>
        <form className="signup" method="post" data-toggle="validator">
          <header>Create Your Account</header>
          <label>Name</label>
          <input
            type="text"
            name="username"
            minLength="3"
            maxLength="15"
            placeholder="Username"
            value={this.state.username}
            onChange={this.onFieldChange} required />
          <div className="help">{erroruser}</div>

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email Id"
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

          <button onClick={this.handleSubmit}>Register</button>
        </form>
      </div>
    );
  }
}

export default Register;
