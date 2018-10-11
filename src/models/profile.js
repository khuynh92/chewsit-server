import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userID: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  username: {type: String, required: true},
  email: {type: String, required: true},
  preferences: {type: Array, default: []},
  favorites: {type: Array, default: []},
});

export default mongoose.model('Profile', profileSchema);