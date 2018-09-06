import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre('save', function(next) {
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

export default mongoose.model('User', userSchema);