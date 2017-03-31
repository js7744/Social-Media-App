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
    }
    this.onFieldChange = this.onFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e){
    let self = this
    axios.post('http://localhost:8000/register', {
      userdata: this.state,
    })

    .then(function (response) {
      alert("Sucessdully Register")
      self.setState({
        username: '',
        email: '',
        password:'',
      })
    })
    .catch(function (error) {
      console.log(error);
    });
    e.preventDefault(e);
  }

  onFieldChange(event){
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  render() {
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
          <div className="help">At least 4 character</div>

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email Id"
            value={this.state.email}
            onChange={this.onFieldChange} required />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="*********"
            maxLength="12"
            value={this.state.password}
            onChange={this.onFieldChange} />
          <div className="help">Use upper, lowercase lettes and special character as well</div>

          <button onClick={this.handleSubmit}>Register</button>
        </form>
      </div>
    );
  }
}

export default Register;
