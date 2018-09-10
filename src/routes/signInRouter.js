import express from 'express';

import auth from '../auth/auth.js';
import oauth from '../auth/oauth.js';

const router = express.Router();

router.get('/signin', auth, (req, res) => {
  res.cookie('token', req.token);
  res.send(req.token);
});

router.get('/oauth/google/code', (req,res,next) => {
  oauth.googleAuthorize(req)
    .then(token => {
      res.cookie('token', token);
      res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    })
    .catch(next);
});

export default router;