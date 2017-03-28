import React, { Component } from 'react';
import logo from '../assets/images/logo.svg';
import facebook from '../assets/images/facebook.svg';
import twitter from '../assets/images/twitter.svg';
import google from '../assets/images/google-plus.svg';
import linkedin from '../assets/images/linkedin.svg';
import instagram from '../assets/images/instagram.svg';
import { Link } from 'react-router';
import '../assets/css/App.css';

class App extends Component {

  render() {
    return (
      <div>
          <div>
            <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
          <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            </button>
            <Link className="navbar-brand active" to="/">
            <img src={logo} width="80" height="40" className="d-inline-block align-top" alt="brand icon"/>
            </Link>
          </div>
          <div className="collapse navbar-collapse" id="myNavbar">
            <ul className="nav navbar-nav navbar-right">
            <li><Link to="login">Login</Link></li>
            <li><Link to="register">Register</Link></li>
            </ul>
          </div>
          </div>
        </nav>
            {this.props.children}
          </div>
        <footer className="footer">
        <div className="row">
              <div className="col-md-3 footer-brand animated fadeInLeft">
            <img src={logo} width="40" height="40" className="d-inline-block align-top" alt="brand logo"/>
                  <h4>Improwised Pvt Ltd</h4>
                    <p>© 2017, All rights reserved</p>
                </div>
              <div className="col-md-4 footer-nav animated fadeInUp">
                  <div className="col-md-6">
                    <h4>Know More</h4><br/>
                        <ul className="pages">
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Contacts</a></li>
                            <li><a href="#">Terms & Condition</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
              <div className="col-md-3 footer-ns animated fadeInRight">
                <h4>Find us at</h4>
                  <ul>
                      <li><a href="#"><img src={facebook} width="40" height="40" className="d-inline-block" id="footerlogo" alt="facbook logo"/> Facebook</a></li>
                      <li><a href="#"><img src={twitter} width="40" height="40" className="d-inline-block" id="footerlogo" alt="twitter logo"/> Twitter</a></li>
                      <li><a href="#"><img src={instagram} width="40" height="40" className="d-inline-block" id="footerlogo" alt="instagram logo"/> Instagram</a></li>
                      <li><a href="#"><img src={google} width="40" height="40" className="d-inline-block" id="footerlogo" alt="google+ logo"/> Google +</a></li>
                      <li><a href="#"><img src={linkedin} width="40" height="40" className="d-inline-block" id="footerlogo" alt="google+ logo"/> LinkedIn</a></li>
                </ul>
              </div>
                </div>
            </footer>
          </div>
        );
      }
    }

export default App
