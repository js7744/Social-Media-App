const express = require('express');
const DB = require('../helpers/db');

const router = express.Router();
const path = require('path');
const multer = require('multer');

const upload = multer({ dest: path.resolve(__dirname, '../public/images/profile') });
const uploadpost = multer({ dest: path.resolve(__dirname, '../public/images/post') });

// GET: /

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/register', upload.single('file'), (req, res, next) => {
  console.log(req.body);
  req.checkBody('userdata.username', 'Username is required').notEmpty();
  req.checkBody('userdata.password', 'Password is required').notEmpty();
  req.checkBody('userdata.email', 'Email is required').notEmpty();

  const id = req.params.id;
  const username = req.body.userdata.username;
  const password = req.body.userdata.password;
  const email = req.body.userdata.email;
  const errors = req.validationErrors();

  if (errors) {
    console.log('Failed something went worong !!');
    const object = {
      data: errors,
    };
    res.send(JSON.stringify(object));
  } else {
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

    DB.executeQuery(query, (error, data) => {
      if (error) {
        next(error);
        return;
      }

      const object = {
        data: data.id,
      };
      res.end(JSON.stringify(object));
    });
  }
});

router.post('/login', (req, res, next) => {
  req.checkBody('userdata.email', 'Email is required').notEmpty();
  req.checkBody('userdata.password', 'Password is required').notEmpty();
  const email = req.body.userdata.email;
  const password = req.body.userdata.password;
  const session = req.session;
  const errors = req.validationErrors();

  if (errors) {
    console.log('Failed something went worong !!');
    const object = {
      data: errors,
    };
    res.send(JSON.stringify(object));
  } else {
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

        const data = {
          id: results.rows[0].id,
        };
        res.send(data);
      }
    });
  }
});

router.get('/home/:id', (req, res, next) => {
  console.log("login");
  const id = req.params.id;
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

        const object = {
          count: c.rows.length,
          follow: follow.rows,
          tweets: tweets.rows,
        };
        res.send(JSON.stringify(object));
      });
    });
  });
});

router.post('/tweet', uploadpost.single('file'), (req, res) => {
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
    const object = {
      ID: id,
    };
    res.status(200).send(object);
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
    const object = {
      Id: Id,
    };
    res.status(200).send(object);
  });
});

router.post('/unfollow', (req, res, next) => {
  const unfollowid = req.body.unfollowid;
  const Id = req.body.data;
  const query = DB.builder()
    .delete()
      .from('follower')
      .where('follow = ? AND login_user = ?', unfollowid, Id)
      .toParam();

  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
      return;
    }
    const object = {
      Id: Id,
    };
    res.status(200).send(object);
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.status(200).end();
  });
});

router.get('/profile/:id', (req, res, next) => {
  const id = req.params.id;
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
      .limit(4)
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

          const object = {
            count: c.rows.length,
            follow: follow.rows,
            tweets: tweets.rows,
            users: users.rows,
          };
          res.status(200).send(object);
        });
      });
    });
  });
});

router.get('/editprofile/:id', (req, res) => {
  const id = req.params.id;
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

      const object = {
        count: c.rows.length,
        users: users.rows,
      };
      res.end(JSON.stringify(object));
    });
  });
});

router.post('/editprofile/:id', upload.single('file'), (req, res) => {
  const id = req.params.id;
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
    const object = {
      data: data.id,
    };
    res.status(200).send(object);
  });
});
module.exports = router;
