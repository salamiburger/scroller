const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/social-shorts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Middleware
app.use(passport.initialize());

// Routes
const videoRoutes = require('./routes/videos');
const authRoutes = require('./routes/auth');
const oauthRoutes = require('./routes/oauth');
const videoFetchRoutes = require('./routes/videofetch');

app.use('/api/videos', videoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/videofetch', videoFetchRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Social Shorts Aggregator API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      oauth: '/api/oauth',
      videos: '/api/videos',
      videofetch: '/api/videofetch'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API Documentation available at http://localhost:${PORT}`);
});
