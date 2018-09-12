import express from 'express';

import User from '../models/users.js';

const router = express.Router();

router.post('/signup', (req, res, next) => {
  if(!Object.keys(req.body).length || !req.body.username || !req.body.email || !req.body.password) {
    next(400);
  }



  let user = new User(req.body);

  user.save()
    .then(user => {
      let token = user.generateToken();
      res.send(token);
    })
    .catch(err => {
      next(err);
    });
  
});
export default router;