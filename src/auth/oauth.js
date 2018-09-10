'use strict';

import superagent from 'superagent';

import User from '../models/users.js';

const googleAuthorize = req => {
  let code = req.query.code;
  console.log('1. the code: ', code);

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
      console.log('2. google token is: ', googleToken);
      return googleToken;
    })
    .then(token => {
      return superagent.get('https://www.googleapis.com/plus/v1/people/me/openIdConnect')
        .set('Authorization', `Bearer ${token}`)
        .then(response => {
          let googleUser = response.body;
          console.log('3. Google User', googleUser);
          return googleUser;
        });
    })
    .then(user => {
      console.log('4. creating user model');
      return User.createFromOAuth(user);
    })
    .then(newUser => {
      console.log('5. user model created, making token');
      req.id = newUser._id;
      return newUser.generateToken();
    });
};

const linkedInAuthorize = req => {
  let code = req.query.code;
  console.log('1. the code: ', code);

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
      console.log('2. linkedin token is: ', linkedInToken);
      return superagent.get('https://api.linkedin.com/v1/people/~:(formatted-name,first-name,last-name,email-address,picture-url)')
        .set('Authorization', `Bearer ${linkedInToken}`)
        .then(response => {
          let linkedInUser = {
            name: response.text.split('<formatted-name>')[1].split('<')[0],
            email: response.text.split('<email-address>')[1].split('<')[0],
            picture: response.text.split('<picture-url>')[1].split('<')[0],
          };
          console.log('3. linkedInUser User', linkedInUser);
          return linkedInUser;
        });
    })
    .then(user => {
      console.log('4. creating user model');
      return User.createFromOAuth(user);
    })
    .then(newUser => {
      console.log('5. user model created, making token');
      req.id = newUser._id;
      return newUser.generateToken();
    });
};

export default {googleAuthorize, linkedInAuthorize};