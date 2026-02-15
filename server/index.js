const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Placeholder for MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/social-shorts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(passport.initialize());

// Routes
const videoRoutes = require('./routes/videos');
const authRoutes = require('./routes/auth');

app.use('/api/videos', videoRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Social Shorts Aggregator API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
