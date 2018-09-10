import express from 'express';

import Profile from '../models/profile.js';

const router = express.Router();

router.get('/api/v1/profiles', (req, res, next) => {
  Profile.find({}, {_id: 0, userID: 0})
    .then(profiles => {
      res.send(profiles);
    }) 
    .catch(err => {
      next(err);
    });
});

router.get('/api/v1/profiles/id/:id',(req, res) => {
  Profile.findOne({_id: req.params.id}, {_id: 0, userID: 0})
    .then(profile => {
      res.send(profile);
    });
});

router.get('/api/v1/profiles/username/:id',(req, res) => {
  Profile.findOne({username: req.params.id}, {_id: 0, userID: 0})
    .then(profile => {
      res.send(profile);
    });
});

export default router;