import express from 'express';
import Profile from '../models/profile.js';

const router = express.Router();

router.get('/api/v1/profiles', (req, res, next) => {
  Profile.find({}, { _id: 0, userID: 0 })
    .then(profiles => {
      res.send(profiles);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/api/v1/profiles/userID/:userID', (req, res) => {
  Profile.findOne({ userID: req.params.userID }, { _id: 0, userID: 0 })
    .then(profile => {
      res.send(profile);
    });
});

router.get('/api/v1/profiles/username/:username', (req, res) => {
  Profile.findOne({ username: req.params.username }, { _id: 0, userID: 0 })
    .then(profile => {
      res.send(profile);
    });
});

router.put('/api/v1/profiles/userID/:userID/preferences', (req, res) => {
  Profile.findOneAndUpdate({ userID: req.params.userID }, { preferences: req.body }, { new: true })
    .then(update => {
      res.send(update.preferences);
    });
});

router.put('/api/v1/profiles/userID/:userID/favorites', (req, res) => {
  Profile.findOne({ userID: req.params.userID })
    .then(profile => {
      let favorites = profile.favorites;
      favorites.push(req.body.newFavorite);
      return favorites;
    })
    .then(favorites => {
      Profile.findOneAndUpdate({ userID: req.params.userID }, { favorites}, { new: true })
        .then(update => {
          res.send(update.favorites);
        });
    });
});

router.put('/api/v1/profiles/userID/:userID/removeFavorite', (req, res) => {
  Profile.findOne({ userID: req.params.userID })
    .then(profile => {
      let favorites = profile.favorites;
      favorites = favorites.filter(restaurant => restaurant !== req.body.removeFavorite)
      return favorites;
    })
    .then(favorites => {
      Profile.findOneAndUpdate({ userID: req.params.userID }, { favorites}, { new: true })
        .then(update => {
          res.send(update.favorites);
        });
    });
});

export default router;