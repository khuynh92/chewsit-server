'use strict';

import superagent from 'superagent';

import User from '../models/users.js';


const facebookAuthorize = req => {

  let code = req.query.code;

  return superagent.get(`https://graph.facebook.com/v3.1/oauth/access_token?client_id=510060352775198&redirect_uri=${process.env.API_URL}/oauth/facebook/code&client_secret=${process.env.FACEBOOK_SECRET}&code=${code}&scope=email`)
    .then( response => {
      let facebookToken = response.body.access_token;
      return facebookToken;
    })
    .then(token => {
      return superagent.get(`https://graph.facebook.com/v3.1/me?fields=name,email`)
        .set('Authorization', `Bearer ${token}`)
        .then(response => {
          let facebookUser = JSON.parse(response.text);
          facebookUser.first_name = facebookUser.name.split(' ')[0];
          facebookUser.last_name = facebookUser.name.split(' ')[1];
          return facebookUser;
        });
    })
    .then(user => {
      console.log('4. creating user model');
      return User.createFromOAuth(user);
    })
    .then(newUser => {
      console.log('5. user model created, making token');
      req.id = newUser.user._id;
      return {token: newUser.user.generateToken(), redirect: newUser.redirect};
    });
};

const googleAuthorize = req => {
  let code = req.query.code;
  return superagent.post('https://www.googleapis.com/oauth2/v4/token')
    .type('form')
    .send({
      code: code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.API_URL}/oauth/google/code`,
      grant_type: 'authorization_code',
    })
    .then( response => {
      let googleToken = response.body.access_token;
      return googleToken;
    })
    .then(token => {
      return superagent.get('https://www.googleapis.com/plus/v1/people/me/openIdConnect')
        .set('Authorization', `Bearer ${token}`)
        .then(response => {
          let googleUser = {
            first_name: response.body.given_name,
            last_name: response.body.family_name,
            id: response.body.sub,
            email: response.body.email,
          };
          return googleUser;
        });
    })
    .then(user => {
      return User.createFromOAuth(user);
    })
    .then(newUser => {
      console.log('5. user model created, making token');
      req.id = newUser.user._id;
      return {token: newUser.user.generateToken(), redirect: newUser.redirect};
    });
};

const linkedInAuthorize = req => {
  let code = req.query.code;

  return superagent.post('https://www.linkedin.com/oauth/v2/accessToken')
    .type('form')
    .send({
      code: code,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      redirect_uri: `${process.env.API_URL}/oauth/linkedIn/code`,
      grant_type: 'authorization_code',
    })
    .then(response => {
      let linkedInToken = response.body.access_token;
      return superagent.get('https://api.linkedin.com/v1/people/~:(id,formatted-name,first-name,last-name,email-address,picture-url)')
        .set('Authorization', `Bearer ${linkedInToken}`)
        .then(response => {
          let linkedInUser = {
            id: response.text.split('<id>')[1].split('<')[0],
            first_name: response.text.split('<formatted-name>')[1].split('<')[0].split(' ')[0],
            last_name: response.text.split('<formatted-name>')[1].split('<')[0].split(' ')[1],
            email: response.text.split('<email-address>')[1].split('<')[0],
            picture: response.text.split('<picture-url>')[1].split('<')[0],
          };
          return linkedInUser;
        });
    })
    .then(user => {
      return User.createFromOAuth(user);
    })
    .then(newUser => {
      console.log('5. user model created, making token');
      req.id = newUser.user._id;
      return {token: newUser.user.generateToken(), redirect: newUser.redirect}
    });
};

export default {googleAuthorize, linkedInAuthorize, facebookAuthorize};