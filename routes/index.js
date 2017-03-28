const express = require('express');
const nodemailer = require('nodemailer');
const DB = require('../helpers/db');

const router = express.Router();
const path = require('path');
const multer = require('multer');

const upload = multer({ dest: path.resolve(__dirname, '../public/images/profile') });
const uploadpost = multer({ dest: path.resolve(__dirname, '../public/images/post') });

// GET: /

router.get('/', (req, res, next) => {
  const query = DB.builder()
    .select()
    .function('NOW()')
    .toParam();

  DB.executeQuery(query, (error, results) => {
    if (error) {
      next(error);
      return;
    }

    res.render('index', {
      title: `Time from the database is ${results.rows[0].now}`,
    });
  });
});

router.post('/register', upload.single('file'), (req, res, next) => {

  id = req.params.id;
  const username = req.body.userdata.username;
  const password = req.body.userdata.password;
  const email = req.body.userdata.email;

  let photo = '';
  if (req.file) {
    photo = req.file.filename;
  } else {
    photo = 'images.png';
  }

    const query = DB.builder()
    .insert()
     .into('registeruser')
     .set('username', username)
     .set('password', password)
     .set('email', email)
     .set('image', photo)
     .toParam();

    DB.executeQuery(query, (error ,data) => {
      if (error) {
        next(error);
        return;
      }

      let object={
          data: data.id
      }
      res.end( JSON.stringify(object));
    });
  });

router.post('/login', (req, res, next) => {

  const email = req.body.userdata.email;
  const password = req.body.userdata.password;
  const session = req.session;

    const query = DB.builder()
    .select()
    .field('username')
    .field('id')
    .from('registeruser')
    .where('email = ? AND password = ?', email, password)
    .toParam();

    DB.executeQuery(query, (error1, results) => {
      if (error1) {
        next(error1);
        return;
      }
      if (results.rowCount) {
        session.user_id = results.rows[0].id;
        session.mail = email;

        let data={
          id : session.user_id
        }
        res.end( JSON.stringify(data))
      }
    });
  });

router.get('/home/:id', (req, res, next) => {

  id = req.params.id;
  let query;
  query = DB.builder()
   .select()
   .field('username')
   .field('tweettxt')
   .field('created_at')
   .field('image')
   .field('post_image')
   .from('registeruser', 'r')
   .join(DB.builder().select().from('tweet'), 'u', 'r.id = u.user_id')
   .where('u.user_id IN ? OR u.user_id= ? ',
    (DB.builder().select().field('follow').from('follower')
   .where('login_user = ?', id)), id)
   .order('created_at', false)
   .toParam();

  DB.executeQuery(query, (error, tweets) => {
    if (error) {

      next(error);
      return;
    }
    query = DB.builder()
    .select()
    .from('registeruser')
    .where('id != ?', id)
    .where('id NOT IN ?',
     DB.builder()
       .select()
       .field('follow')
       .from('follower')
       .where('login_user = ?', id))
       .order('RANDOM()')
       .limit(1)
       .toParam();


    DB.executeQuery(query, (error2, follow) => {
      if (error2) {
        next(error2);
        return;
      }
      query = DB.builder()
          .select()
          .from('follower')
          .where('login_user = ?', id)
          .toParam();
          DB.executeQuery(query, (errortweets, c) => {
            if (errortweets) {
              next(errortweets);
              return;
            }

      let object={
        count: c.rows.length,
        follow: follow.rows,
        tweets: tweets.rows,
      }
      res.end(JSON.stringify(object));
    });
  });
  });
});

router.post('/tweet', uploadpost.single('file'), (req, res, next) => {
  let photo = '';
  if (req.file) {
    photo = req.file.filename;
  } else {
    photo = '';
  }
  const tweet = req.body.data;
  const id = req.body.userid;

  const query = DB.builder()
    .insert()
      .into('tweet')
      .set('tweettxt', tweet)
      .set('like', '1')
      .set('created_at', 'now()')
      .set('post_image', photo)
      .set('user_id', id)
      .toParam();

  DB.executeQuery(query, (error) => {
    if (error) {
      return;
    }
    let object = {
      "ID" : id
    }
    res.send(JSON.stringify(object));
  });
});

router.post('/follow', (req, res, next) => {
  const followid = req.body.followerid;
  const Id = req.body.data;
  const query = DB.builder()
    .insert()
      .into('follower')
      .set('login_user', Id)
      .set('follow', followid)
      .toParam();

  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
      return;
    }
    let object={
      "Id" : Id
    }
    res.send(JSON.stringify(object));
  });
});

router.get('/followmore', (req, res, next) => {
  const session = req.session;
  let query;
  if (req.session.mail) {
    query = DB.builder()
    .select()
    .field('username')
    .field('image')
    .from('registeruser', 'users')
    .where('id = ?', req.session.user_id)
    .toParam();

    DB.executeQuery(query, (error3, users) => {
      if (error3) {
        next(error3);
        return;
      }

      query = DB.builder()
      .select()
      .from('registeruser')
      .where('id != ?', req.session.user_id)
      .where('id NOT IN ?',
       DB.builder()
         .select()
         .field('follow')
         .from('follower')
         .where('login_user = ?', req.session.user_id))
         .toParam();

      DB.executeQuery(query, (error4, follow) => {
        if (error4) {
          next(error4);
          return;
        }
        res.render('followmore', {
          users: users.rows,
          follow: follow.rows,
        });
      });
    });
  } else {
    res.render('index');
  }
});

router.post('/unfollow', (req, res, next) => {

  const unfollowid = req.body.unfollowid;
  const Id = req.body.data;

  const query = DB.builder()
    .delete()
      .from('follower')
      .where('follow = ? AND login_user = ?' , unfollowid, Id)
      .toParam();

  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
      return;
    }
    let object={
      "Id" : Id
    }
    res.send(JSON.stringify(object));

  });
});

router.get('/logout', (req, res) => {
  const session = req.session;
    req.session.destroy(() => {
      res.end();
    });
});

router.get('/profile/:id', (req, res, next) => {

  id = req.params.id;
  let query;

  query = DB.builder()
    .select()
    .field('username')
    .field('tweettxt')
    .field('created_at')
    .field('image')
    .field('post_image')
    .from('registeruser', 'regs')
    .join(DB.builder().select().from('tweet'), 'u', 'regs.id= u.user_id')
    .where('regs.id = ?', id)
    .order('created_at', false)
    .toParam();

  DB.executeQuery(query, (error, tweets) => {
    if (error) {
      next(error);
      return;
    }

    query = DB.builder()
    .select()
    .field('username')
    .field('image')
    .from('registeruser', 'users')
    .where('id = ?', id)
    .toParam();

    DB.executeQuery(query, (error3, users) => {
      if (error3) {
        next(error3);
        return;
      }

      query = DB.builder()
      .select()
      .field('username')
      .field('follow')
      .field('image')
      .from('registeruser', 'regs')
      .join(DB.builder().select().from('follower'), 'u', 'regs.id= u.follow')
      .where('regs.id != ?', id)
      .order('RANDOM()')
      .limit(5)
      .toParam();

      DB.executeQuery(query, (error4, follow) => {
        if (error4) {
          next(error4);
          return;
        }
        query = DB.builder()
          .select()
          .from('follower')
          .where('login_user = ?', id)
          .toParam();
          DB.executeQuery(query, (errortweets, c) => {
            if (errortweets) {
              next(errortweets);
              return;
            }

        let object={
        count: c.rows.length,
        follow: follow.rows,
        tweets: tweets.rows,
        users: users.rows,
      }
        res.end(JSON.stringify(object));
        });
      });
    });
  });
});

router.get('/editprofile/:id', (req, res) => {

  id = req.params.id;
  let query;
  query = DB.builder()
    .select()
    .field('username')
    .field('password')
    .field('email')
    .field('image')
    .from('registeruser')
    .where('id = ?', id)
    .toParam();

  DB.executeQuery(query, (error, users, next) => {
    if (error) {
      next(error);
      return;
    }
    query = DB.builder()
          .select()
          .from('follower')
          .where('login_user = ?', id)
          .toParam();
          DB.executeQuery(query, (errortweets, c) => {
            if (errortweets) {
              next(errortweets);
              return;
            }

        let object={
        count: c.rows.length,
        users: users.rows,
      }
      res.end(JSON.stringify(object));
    });
  });
});

router.post('/editprofile/:id', upload.single('file'), (req, res, next) => {

  id = req.params.id;
  const username = req.body.userdata.username;
  const password = req.body.userdata.password;
  const email = req.body.userdata.email;

  let photo = '';
  if (req.file) {
    photo = req.file.filename;
  } else {
    photo = 'images.png';
  }

  const query = DB.builder()
   .update()
     .table('registeruser')
     .set('username', username)
     .set('email', email)
     .set('password', password)
     .set('image', photo)
     .where('id = ?', id)
     .toParam();

  DB.executeQuery(query, (error, data) => {
    if (error) {
      console.log('Error', error);
    }
    let object={
        data: data.id
    }
      res.end(JSON.stringify(object));
  });
});
module.exports = router;
