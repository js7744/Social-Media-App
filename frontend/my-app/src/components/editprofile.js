import React, { Component } from 'react';
import axios from 'axios';
import logo from '../assets/images/logo.svg';
import { Link, browserHistory } from 'react-router';
import '../assets/css/editprofile.css';
import cookie from 'react-cookie';

class Editprofile extends Component {
    constructor(props) {
        super(props);
        this.state={
        username:'',
        email:'',
        password:'',
        data: '',
        }
        this.onFiledChange = this.onFiledChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

  editprofileapicall() {
    if(cookie.load(this.props.params.id)) {
    let userId = this.props.params.id;
    axios.get('http://localhost:8000/editprofile/' + userId)
    .then(res => {

      this.setState({
        username: res.data.users[0].username,
        email: res.data.users[0].email,
        password: res.data.users[0].password,
      })
      const data= res.data;
      this.setState({
        data: data,
      })
    });
    } else {
      browserHistory.push('/login');
    }
  }

  componentWillMount() {
    this.editprofileapicall();
  }

  handleSubmit(e) {
    let self = this;
    alert("values sucessfuly update..!!")
    let id = this.props.params.id;
    axios.post('http://localhost:8000/editprofile/' + id,
     {
      userdata : this.state,
      userid : this.props.params.id,
    })
    .then(function (response) {
      self.editprofileapicall();
      self.setState({
        username: '',
        email: '',
        password: '',
      })
    })
    .catch(function (error) {
      console.log(error);
    });
    e.preventDefault(e);
  }


  onFiledChange(event) {
    this.setState({
      [ event.target.name]: event.target.value
    });
  }


  render() {
    var editprofile = [];
    if(this.state.data){
          editprofile.push(
              <div className="panel-body">
                      <h3 className="panel-title pull-left">Your Info</h3>
                      <br/><br/>
                      <form className="form-horizontal">
                          <label>Username</label>
                          <input name="username" onChange={this.onFiledChange} value={this.state.username} type="text" className="form-control" id="First_name" />
                          <label>Email</label>
                          <input name="email" onChange={this.onFiledChange} value={this.state.email} type="email" className="form-control" id="Last_name" />
                          <label>Password</label>
                          <input name="password" onChange={this.onFiledChange} value={this.state.password} type="password" className="form-control" id="Last_name" />
                      </form><br/>
                      <button onClick={this.handleSubmit} className="btn btn-primary">submit</button>
                  </div>
              )

    }

    let userimage = '';
    if(this.state.data.users){
       userimage = `http://localhost:8000/images/profile/${this.state.data.users[0].image}`;
    }
    const Home = (id) => `/home/${this.props.params.id}`;
    const Profile = (id) => `/profile/${this.props.params.id}`;


    return (
      <div>
        <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
          <div className="container-fluid" id="editProfileNav">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" id="editProfileNav" data-toggle="collapse" data-target="#myNavbar">
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              </button>
              <Link className="navbar-brand active" id="editProfileNav" to="/">
              <img src={logo} width="80" height="40" className="d-inline-block align-top" alt="brand icon"/>
              </Link>
            </div>
            <div className="collapse navbar-collapse" id="myNavbar">
              <ul className="nav navbar-nav navbar-right" id="editProfileNav">
              <li><Link to={Home}>Home</Link></li>
              <li><Link to={Profile}>Profile</Link></li>
              <li><Link to="/logout">Logout</Link></li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="col-lg-3 col-md-3 hidden-sm hidden-xs">
            <div className="panel panel-default" id="settings">
                <div className="panel-body">
                    <h1 className="panel-title pull-left"><i className="fa fa-cogs" aria-hidden="true"></i> Settings</h1>
                </div>
            </div>
        </div>
        <div className="col-lg-5 col-md-9 col-sm-12 col-xs-12">
            <div className="panel panel-default" id="basicInfo">
                <div className="panel-body">
                    <h1 className="panel-title pull-left">My basic profile</h1>
                </div>
            </div>
            <div className="panel panel-default" id="userImg">
                <div className="panel-body">
                    <div className="edituser">
                        <div className="col-lg-12 col-md-12">
                            <img className="img-thumbnail img-responsive" src={ userimage } width="300px" height="300px" alt="edituser"/>
                        </div>
                        <div className="col-lg-7 col-md-5">
                            <br/>
                            <input onChange={this.onFiledChange} value={this.state.image} id="choosefile" type="file" name="file" className="form-control"/>
                            <button className="btn btn-primary"><i className="fa fa-upload" aria-hidden="true"></i> Upload a new profile photo!</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="panel panel-default" id="userInfo">{ editprofile }</div>
          </div>
      </div>
      );
    }
  }

export default Editprofile
