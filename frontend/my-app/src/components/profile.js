import React, { Component } from 'react';
import axios from 'axios';
import edit from '../assets/images/edit.svg';
import logo from '../assets/images/logo.svg';
import { Link, browserHistory } from 'react-router';
import '../assets/css/profile.css';
import cookie from 'react-cookie';

class Profile extends Component {
  constructor(props) {
    super(props);
      this.state={
        data: '',
        id: '',
        tweettxt:'',
        twitted:false,
      }
      this.onFiledChange = this.onFiledChange.bind(this);
      this.onsubmittweet = this.onsubmittweet.bind(this);
      this.onUnfollow = this.onUnfollow.bind(this);
    }

  profileapicall(){
    console.log("======>>>",cookie.load(this.props.params.id))
    if(cookie.load(this.props.params.id)) {
    let userId = this.props.params.id;
    axios.get('http://localhost:8000/profile/' + userId)
    .then(res => {
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
    this.profileapicall();
  }

  onUnfollow(id) {
    let self = this;
    axios.post('http://localhost:8000/unfollow', {
      data : this.props.params.id,
      unfollowid: id,
    })
    .then(function (response) {
      self.profileapicall();
    })
    .catch(function (error) {
    })
  }

  onsubmittweet(e) {
    let self = this;
    let id = this.props.params.id;
    axios.post('http://localhost:8000/tweet', {
      data : this.state.tweettxt,
      userid : id,
    })
    .then(function (response) {
      self.profileapicall();
      self.setState({
        tweettxt: '',
      })
    })
    .catch(function (error) {
      console.log(error);
    });
    self.setstate({'twitted': 'true',})
    e.preventDefault(e);
  }

  onFiledChange(event) {
    this.setState({
      [ event.target.name]: event.target.value
    });
  }

  render() {
    var tweet= [];
    console.log(this.state.data.count)
      if(this.state.data){
        for(var i = 0; i < this.state.data.tweets.length; i++) {
          if(this.state.data.tweets[i].post_image) {
            let imgsrc = '', tweetimg='', createdAt='';
            imgsrc = `http://localhost:8000/images/profile/${this.state.data.tweets[i].image}`;
            tweetimg = `http://localhost:8000/images/post/${this.state.data.tweets[i].post_image}`;
            createdAt = this.state.data.tweets[i].created_at;

            tweet.push(
                <div key={i} className="panel-body" id="profileTweet">
                      <div className="pull-left">
                          <a href="#">
                              <img className="media-object img-circle" src={ imgsrc } width="50%" height="50%" alt="user" />
                          </a>
                      </div>
                      <span>
                        <h4><a href="#"><strong>{this.state.data.tweets[i].username}</strong></a> – <small><small><a href="#"><i><i className="fa fa-clock-o" aria-hidden="true"></i> {createdAt}</i></a></small></small></h4>
                          <div className="navbar-right">
                              <div className="dropdown">
                                  <button className="btn btn-link btn-xs dropdown-toggle" type="button" id="dd1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                      <i className="fa fa-cog" aria-hidden="true"></i>
                                      <span className="caret"></span>
                                  </button>
                                  <ul className="dropdown-menu" aria-labelledby="dd1">
                                      <li><a href="#"><i className="fa fa-fw fa-exclamation-triangle" aria-hidden="true"></i> Report</a></li>
                                      <li><a href="#"><i className="fa fa-fw fa-ban" aria-hidden="true"></i> Ignore</a></li>
                                      <li><a href="#"><i className="fa fa-fw fa-bell" aria-hidden="true"></i> Enable notifications for this post</a></li>
                                      <li><a href="#"><i className="fa fa-fw fa-eye-slash" aria-hidden="true"></i> Hide</a></li>
                                      <li role="separator" className="divider"></li>
                                      <li><a href="#"><i className="fa fa-fw fa-trash" aria-hidden="true"></i> Delete</a></li>
                                  </ul>
                              </div>
                          </div>
                      </span>
                    <hr />
                    <div className="post-content">
                        <h4 key={i} >{this.state.data.tweets[i].tweettxt}</h4>
                        <img className="tweetImg" src={ tweetimg } width="100%" height="100%" alt="userpost" />
                    </div>
                    <hr/>
                    <div>
                        <div className="pull-right btn-group-xs">
                            <a className="btn btn-default btn-xs"><i className="fa fa-heart" aria-hidden="true"></i> Like</a>
                            <a className="btn btn-default btn-xs"><i className="fa fa-retweet" aria-hidden="true"></i> Reshare</a>
                            <a className="btn btn-default btn-xs"><i className="fa fa-comment" aria-hidden="true"></i> Comment</a>
                        </div>
                        <div className="pull-left">
                            <p className="text-muted" ><i className="fa fa-globe" aria-hidden="true"></i> Public</p>
                        </div>
                        <br/>
                    </div>
                    <hr />
                    <div className="media">
                        <div className="pull-left">
                            <a href="#">
                                <img className="media-object img-circle" id="userComment" src={ imgsrc } width="35px" height="35px" alt="user" />
                            </a>
                        </div>
                        <div className="media-body">
                          <textarea className="form-control" rows="1" placeholder="Comment"></textarea>
                        </div>
                    </div>
                </div>
              );
            } else {
            let imgsrc = '', tweetimg='', createdAt='';
            if(this.state.data.tweets[i].image) {
              imgsrc = `http://localhost:8000/images/profile/${this.state.data.tweets[i].image}`;
              tweetimg = `http://localhost:8000/images/post/${this.state.data.tweets[i].image}`;
              createdAt = this.state.data.tweets[i].created_at;

              tweet.push(
                  <div key={i} className="panel-body" id="profileTweet">
                        <div className="pull-left">
                            <a href="#">
                                <img className="media-object img-circle" src={ imgsrc } width="45%" height="35%" alt="user" />
                            </a>
                        </div>
                        <span>
                          <h4><a href="#"><strong>{this.state.data.tweets[i].username}</strong></a> – <small><small><a href="#"><i><i className="fa fa-clock-o" aria-hidden="true"></i> {createdAt}</i></a></small></small></h4>
                            <div className="navbar-right">
                                <div className="dropdown">
                                    <button className="btn btn-link btn-xs dropdown-toggle" type="button" id="dd1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        <i className="fa fa-cog" aria-hidden="true"></i>
                                        <span className="caret"></span>
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dd1">
                                        <li><a href="#"><i className="fa fa-fw fa-exclamation-triangle" aria-hidden="true"></i> Report</a></li>
                                        <li><a href="#"><i className="fa fa-fw fa-ban" aria-hidden="true"></i> Ignore</a></li>
                                        <li><a href="#"><i className="fa fa-fw fa-bell" aria-hidden="true"></i> Enable notifications for this post</a></li>
                                        <li><a href="#"><i className="fa fa-fw fa-eye-slash" aria-hidden="true"></i> Hide</a></li>
                                        <li role="separator" className="divider"></li>
                                        <li><a href="#"><i className="fa fa-fw fa-trash" aria-hidden="true"></i> Delete</a></li>
                                    </ul>
                                </div>
                            </div>
                        </span>
                      <hr />
                      <div className="post-content">
                          <h4 key={i} >{this.state.data.tweets[i].tweettxt}</h4>
                      </div>
                      <hr/>
                      <div>
                          <div className="pull-right btn-group-xs">
                              <a className="btn btn-default btn-xs"><i className="fa fa-heart" aria-hidden="true"></i> Like</a>
                              <a className="btn btn-default btn-xs"><i className="fa fa-retweet" aria-hidden="true"></i> Reshare</a>
                              <a className="btn btn-default btn-xs"><i className="fa fa-comment" aria-hidden="true"></i> Comment</a>
                          </div>
                          <div className="pull-left">
                              <p className="text-muted" ><i className="fa fa-globe" aria-hidden="true"></i> Public</p>
                          </div>
                          <br/>
                      </div>
                      <hr />
                      <div className="media">
                          <div className="pull-left">
                              <a href="#">
                                  <img className="media-object img-circle" id="userComment" src={ imgsrc } width="35px" height="35px" alt="user" />
                              </a>
                          </div>
                          <div className="media-body">
                            <textarea className="form-control" rows="1" placeholder="Comment"></textarea>
                          </div>
                      </div>
                  </div>
                );
              }
            }
          }
        }

    var follow = [];
    if(this.state.data.follow) {

     for ( i = 0; i < this.state.data.follow.length ; i++) {
      let followimg;
          if(this.state.data.follow[i].image) {
            followimg = `http://localhost:8000/images/profile/${this.state.data.follow[i].image}`;
          }
      if(this.state.data.follow) {
        let a = this.state.data.follow[i].follow;

        follow.push(
           <div key={i} className="panel-body" id="followUsers">
                <img className="thumbnail img-responsive" id="followFriends" name="profile" src={ followimg } alt="followerimage" height="60%" width="100%" />
                <h3>{this.state.data.follow[i].username}</h3>
                <form >
                  <input type="hidden" name="followId" value={a}/>
                  <input onClick={ (e) => {
                      this.onUnfollow(a);
                      e.preventDefault();
                    }}
                    type="submit"
                    value="UnFollow"
                    className="btn-sm btn-info waves-effect waves-light"/>
                </form>
              </div>
          );
        }
      }
    }

    let username = '', userimg = '';
    if(this.state.data.users){
      userimg = `http://localhost:8000/images/profile/${this.state.data.users[0].image}`;
      username = this.state.data.users[0].username;
    }

    const home = (id) => `/home/${this.props.params.id}`;
    const editprofile = (id) => `/editprofile/${this.props.params.id}`;


    return (
      <div>
        <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
          <div className="container-fluid" id="profileNav">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" id="profileNav" data-toggle="collapse" data-target="#myNavbar">
              <span className="icon-bar"></span>

              </button>
              <Link className="navbar-brand active" id="profileNav" to="/">
              <img src={logo} width="80" height="40" className="d-inline-block align-top" alt="brand icon"/>
              </Link>
            </div>

            <div className="collapse navbar-collapse" id="myNavbar">
              <ul className="nav navbar-nav navbar-right" id="profileNav">
              <li><Link to={home}>Home</Link></li>
              <li><Link to={editprofile}>EditProfile</Link></li>
              <li><Link to="/logout">Logout</Link></li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="col-lg-3 col-md-3">
            <div className="panel panel-default" id="userProfile">
                <div className="panel-body" id="userPannel">
                    <div className="media">
                      <div className="userprofile">
                        <div>
                            <img className="thumbnail img-responsive" id="userimage" src={ userimg } width="100%" height="60%" alt="userprofile" />
                        </div>
                        <div className="media-body">
                            <hr/>
                            <h3><strong>{username}</strong></h3>
                        </div>
                      </div>
                    </div>
                </div>
            </div>

            <div className="navbar-header">
              <button type="button" className="navbar-toggle btn-info waves-effect waves-light" id="followButton" data-toggle="collapse" data-target="#toggleTarget">
              <p>Find Friends</p>
              </button>
            </div>

            <div className="imageheader"></div>
              <div className="panel panel-default" id="toggleTarget">
                <div className="panel-body">
                  {follow}
                </div>
              </div>
          </div>

        <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12">
          <div className="Content" id="profileContent">
            <div className="panel panel-default" id="ProfileFirstPannel" >
                <div className="panel-body">
                    <span>
                        <h1 className="panel-title pull-left" ><img src={edit} alt="edit" height="20px" width="20px" /> What's on your mind ? </h1>
                    </span>
                </div>
                <div className="media-body">
                  <textarea id="text" rows="5" name="tweettxt" maxLength="140" className="form-control" onChange={this.onFiledChange} value={this.state.tweettxt} ></textarea>
                </div>
                <input onChange={this.onFiledChange} value={this.state.tweetimg} id="choosefile" type="file" name="file" className="form-control"/>
                <div>
                  <span className="pull-left">
                    <button onClick={this.onsubmittweet} type="submit" className="btn btn-primary form-control">Post</button>
                  </span>
                </div>
                <br/><br/>
            </div>
            <div className="panel panel-default" >
              {tweet}
            </div>
        </div>
      </div>

    </div>
    );
  }
}

export default Profile
