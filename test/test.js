const should = require('should');
const request = require('supertest');
const app = require('../app');
// request = request('http://localhost:3000');

const registeruser = {
  userdata: {
    id: 108,
    username: 'jatin',
    password: 'jatin',
    email: 'jatin@gmail.com',
    image: '2567901bf9cbf2c5ede7317aba2379bc',
  },
};

const tweet = {
  data: 'hello.. ',
  user_id: registeruser.userdata.id,
  post_image: '9c37ee2f60a1350aba2974cb1b997a2e',
};

const editprofile = {
  userdata: {
    username: 'sagar',
    password: 'sagar',
    email: 'sagar@gmail.com',
    image: '2567901bf9cbf2c5ede7317aba2379bc',
  },
};

const follow = {
  data: registeruser.userdata.id,
  followerid: '60',
};

describe('index', () => {
  describe('GET /', () => {
    it('should return a cover page', (done) => {
      request(app)
        .get('/')
        .expect('Content-type', 'text/html; charset=utf-8')
        .expect(200)
        .end((err, res) => {
          res.status.should.be.equal(200);
          done();
        });
    });
  });

  describe('POST /register', () => {
    it('should response register', (done) => {
      request(app)
        .post('/register')
        .send(registeruser)
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            res.status.should.be.equal(200);
            done();
          }
        });
    });
  });

  describe('POST /login', () => {
    it('should response login', (done) => {
      request(app)
        .post('/login')
        .send(registeruser)
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            (res.body.id).should.be.equal(registeruser.userdata.id);
            res.status.should.be.equal(200);
            done();
          }
        });
    });
  });

  describe(`GET /home/ + ${registeruser.userdata.id}`, () => {
    it('should return home page', (done) => {
      request(app)
      .get(`/home/ + ${registeruser.userdata.id}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          res.status.should.be.equal(200);
          done();
        }
      });
    });
  });

  describe('POST /tweet', () => {
    it('user can tweet', (done) => {
      request(app)
        .post('/tweet')
        .send(tweet)
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            res.status.should.be.equal(200);
            done();
          }
        });
    });
  });

  describe('POST /follow', () => {
    it('user can follow other user', (done) => {
      request(app)
        .post('/follow')
        .send(follow)
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            res.status.should.be.equal(200);
            done();
          }
        });
    });
  });

  describe('POST /unfollow', () => {
    it('user can follow other user', (done) => {
      request(app)
        .post('/unfollow')
        .send(follow)
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            res.status.should.be.equal(200);
            done();
          }
        });
    });
  });


  describe(`GET /profile/ + ${registeruser.userdata.id}`, () => {
    it(' should return profile page', (done) => {
      request(app)
      .get(`/profile/ + ${registeruser.userdata.id}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          res.status.should.be.equal(200);
          done();
        }
      });
    });
  });

  describe(`POST /editprofile/ + ${registeruser.userdata.id}`, () => {
    it('user can edit their profile', (done) => {
      request(app)
        .post(`/editprofile/ + ${registeruser.userdata.id}`)
        .send(editprofile)
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            res.status.should.be.equal(200);
            done();
          }
        });
    });
  });

  describe('GET /logout', () => {
    it('should return a main index page', (done) => {
      request(app)
        .get('/logout')
        .expect('Content-type', 'text/html; charset=utf-8')
        .expect(200)
        .end((err, res) => {
          res.status.should.be.equal(200);
          done();
        });
    });
  });
});
