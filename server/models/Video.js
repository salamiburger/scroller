const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoId: String,
  source: { type: String, enum: ['youtube', 'instagram', 'tiktok', 'facebook'] },
  title: String,
  description: String,
  url: String,
  thumbnail: String,
  creator: String,
  creatorId: String,
  duration: Number,
  likes: Number,
  views: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fetchedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(+new Date() + 7*24*60*60*1000) } // 7 days
});

videoSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

module.exports = mongoose.model('Video', videoSchema);
