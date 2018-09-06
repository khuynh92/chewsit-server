import express from 'express';

import User from '../models/users.js';

const router = express.Router();

router.get('/api/v1/users', (req, res, next) => {
  res.send('hello world!');
});

router.post('/signup', (req, res, next) => {
  if(!Object.keys(req.body).length) {
    next(400);
  }

  let user = new User(req.body);

  user.save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      next(err);
    });
  
});
export default router;