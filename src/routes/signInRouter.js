import express from 'express';

import auth from '../auth/auth.js';
import oauth from '../auth/oauth.js';

const router = express.Router();

router.get('/signin', auth, (req, res) => {
  res.cookie('token', req.token);
  res.send(req.token);
});

router.get('/oauth/google/code', (req, res, next) => {
  oauth.googleAuthorize(req)
    .then(user => {
      res.cookie('token', user.token, {domain: 'chewsit3.herokuapp.com/'});

      if (user.redirect) {
        res.redirect(`${process.env.CLIENT_URL}/preferences`);
      } else {
        res.redirect(`${process.env.CLIENT_URL}/dashboard`);
      }
    })
    .catch(next);
});

router.get('/oauth/linkedIn/code', (req, res, next) => {
  oauth.linkedInAuthorize(req)
    .then(user => {
      res.cookie('token', user.token, {domain: 'chewsit3.herokuapp.com/'});

      if (user.redirect) {
        res.redirect(`${process.env.CLIENT_URL}/preferences`);

      } else {
        res.redirect(`${process.env.CLIENT_URL}/dashboard`);
      }
    })
    .catch(next);
});

router.get('/oauth/facebook/code', (req, res, next) => {
  oauth.facebookAuthorize(req)
    .then(user => {
      res.cookie('token', user.token, {domain: 'chewsit3.herokuapp.com/'});

      if (user.redirect) {
        res.redirect(`${process.env.CLIENT_URL}/preferences`);

      } else {
        res.redirect(`${process.env.CLIENT_URL}/dashboard`);
      }
    })
    .catch(next);
});

export default router;