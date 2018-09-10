import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Profile from './profile.js';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'guest', 'editor', 'user'], default: 'user' },
});

const capabilities = {
  user: ['read'],
  editor: ['read', 'update'],
  admin: ['create', 'read', 'update', 'delete'],
};


userSchema.pre('save', function (next) {
  bcrypt.hash(this.password, 10)
    .then(hash => {
      console.log(hash);
      this.password = hash;
      next();
    })
    .catch(err => {
      throw err;
    });
});

userSchema.post('save', function (next) {

  let newProfile = new Profile({
    userID: this._id,
    username: this.username,
    email: this.email,
  });

  newProfile.save()
    .then(() => {
      console.log('profile created!');
      next();
    })
    .catch(err => {
      throw err;
    });
});

userSchema.statics.authenticate = function (userObj) {
  return this.findOne({ username: userObj.username })
    .then(user => user && user.passwordCheck(userObj.password))
    .catch(err => { throw err; });
};

userSchema.statics.authorize = function (token) {
  let user = jwt.verify(token, process.env.APP_SECRET || 'somethingelseifoauth');
  return this.findOne({ _id: user.id })
    .then(user => {
      return user;
    })
    .catch(err => { throw err; });
};

userSchema.methods.passwordCheck = function (password) {
  return bcrypt.compare(password, this.password)
    .then(response => {
      return response ? this : null;
    });
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, capabilities: capabilities[this.role] }, process.env.APP_SECRET || 'somethingelseifoauth');
};

userSchema.statics.createFromOAuth = function (googleUser) {
  if (!googleUser || !googleUser.email) {
    return Promise.reject('VALIDATION ERROR: missing username/email or password');
  }

  return this.findOne({ email: googleUser.email })
    .then(user => {
      if (!user) { throw new Error('User Not Found'); }
      console.log('Welcome Back!', user.username);
      return { user, redirect: false };
    })
    .catch((error) => {
      console.log(error);
      console.log(googleUser);
      let username = googleUser.email;
      let password = googleUser.given_name + googleUser.sub + googleUser.family_name + 'youwontguessthispassword';
      return this.create({
        username: username,
        password: password,
        email: googleUser.email,
      }).then(newUser => {
        return {user: newUser, redirect: true};
      });

    });
};

export default mongoose.model('User', userSchema);