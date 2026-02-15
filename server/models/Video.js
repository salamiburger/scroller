const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoId: String,
  source: { type: String, enum: ['youtube', 'instagram', 'tiktok'] },
  title: String,
  description: String,
  url: String,
  thumbnail: String,
  creator: String,
  duration: Number,
  likes: Number,
  views: Number,
  fetchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);
