import React, { Component } from 'react';
import '../assets/css/cover.css';
import a from '../assets/images/a.jpg';
import b from '../assets/images/b.jpg';
import c from '../assets/images/c.jpg';

class Cover extends Component {
  render() {
    return (
      <div className="coverCarousel">
      <div id="carousel-example-generic" className="carousel slide" data-ride="carousel">

        <ol className="carousel-indicators">
          <li data-target="#carousel-example-generic" data-slide-to="0" className="active"></li>
          <li data-target="#carousel-example-generic" data-slide-to="1"></li>
          <li data-target="#carousel-example-generic" data-slide-to="2"></li>
        </ol>


        <div className="carousel-inner" role="listbox">
          <div className="item active">
            <img src={b} alt="..." />
            <div className="carousel-caption">
              <h1>Hola !! Are you in search of friends</h1>
              <h2>Regiter here..</h2>
            </div>
          </div>
          <div className="item">
            <img src={a} alt="..." />
            <div className="carousel-caption">
              <h1>Create your network here, make friends follow them, make tweets and many more.</h1>
              <h2>Hurry up !! Friends are waiting for you</h2>
            </div>
          </div>
          <div className="item">
            <img src={c} alt="..." />
            <div className="carousel-caption">
              <h1>Chat, Tag, Share, and More..</h1>
              <h2>Your friends uploding many stuff everyday..</h2>
            </div>
          </div>
        </div>


        <a className="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
          <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>
        <a className="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
          <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>
      </div>
      </div>
    );
  }
}

export default Cover;
