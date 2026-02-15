const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  profilePicture: String,
  
  // OAuth Tokens
  google: {
    accessToken: String,
    refreshToken: String,
    email: String,
    name: String,
    picture: String,
    connected: { type: Boolean, default: false }
  },
  
  facebook: {
    accessToken: String,
    refreshToken: String,
    id: String,
    name: String,
    picture: String,
    connected: { type: Boolean, default: false }
  },
  
  instagram: {
    accessToken: String,
    refreshToken: String,
    id: String,
    name: String,
    picture: String,
    connected: { type: Boolean, default: false }
  },
  
  tiktok: {
    accessToken: String,
    refreshToken: String,
    id: String,
    name: String,
    picture: String,
    connected: { type: Boolean, default: false }
  },
  
  youtube: {
    accessToken: String,
    refreshToken: String,
    channelId: String,
    channelTitle: String,
    picture: String,
    connected: { type: Boolean, default: false }
  },
  
  createdAt: { type: Date, default: Date.now },
  lastVideoFetch: Date
});

module.exports = mongoose.model('User', userSchema);
