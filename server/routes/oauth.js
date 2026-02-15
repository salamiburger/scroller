const express = require('express');
const router = express.Router();
const User = require('../models/User');
const axios = require('axios');
require('dotenv').config();

// Middleware to check if user is authenticated
const auth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
};

// Get current user and connected accounts
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -google.accessToken -facebook.accessToken -instagram.accessToken -tiktok.accessToken -youtube.accessToken');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get connected accounts status
router.get('/accounts', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const accounts = {
      google: user.google.connected,
      facebook: user.facebook.connected,
      instagram: user.instagram.connected,
      tiktok: user.tiktok.connected,
      youtube: user.youtube.connected
    };
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// OAuth callback handlers
router.post('/google-callback', auth, async (req, res) => {
  try {
    const { accessToken, refreshToken, email, name, picture } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        'google.accessToken': accessToken,
        'google.refreshToken': refreshToken,
        'google.email': email,
        'google.name': name,
        'google.picture': picture,
        'google.connected': true
      },
      { new: true }
    );
    
    res.json({ message: 'Google account connected', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/facebook-callback', auth, async (req, res) => {
  try {
    const { accessToken, refreshToken, id, name, picture } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        'facebook.accessToken': accessToken,
        'facebook.refreshToken': refreshToken,
        'facebook.id': id,
        'facebook.name': name,
        'facebook.picture': picture,
        'facebook.connected': true
      },
      { new: true }
    );
    
    res.json({ message: 'Facebook account connected', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/instagram-callback', auth, async (req, res) => {
  try {
    const { accessToken, id, name, picture } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        'instagram.accessToken': accessToken,
        'instagram.id': id,
        'instagram.name': name,
        'instagram.picture': picture,
        'instagram.connected': true
      },
      { new: true }
    );
    
    res.json({ message: 'Instagram account connected', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/tiktok-callback', auth, async (req, res) => {
  try {
    const { accessToken, id, name, picture } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        'tiktok.accessToken': accessToken,
        'tiktok.id': id,
        'tiktok.name': name,
        'tiktok.picture': picture,
        'tiktok.connected': true
      },
      { new: true }
    );
    
    res.json({ message: 'TikTok account connected', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/youtube-callback', auth, async (req, res) => {
  try {
    const { accessToken, refreshToken, channelId, channelTitle, picture } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        'youtube.accessToken': accessToken,
        'youtube.refreshToken': refreshToken,
        'youtube.channelId': channelId,
        'youtube.channelTitle': channelTitle,
        'youtube.picture': picture,
        'youtube.connected': true
      },
      { new: true }
    );
    
    res.json({ message: 'YouTube account connected', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Disconnect account
router.post('/disconnect/:platform', auth, async (req, res) => {
  try {
    const { platform } = req.params;
    
    if (!['google', 'facebook', 'instagram', 'tiktok', 'youtube'].includes(platform)) {
      return res.status(400).json({ error: 'Invalid platform' });
    }
    
    const updateObj = {};
    updateObj[`${platform}.connected`] = false;
    updateObj[`${platform}.accessToken`] = null;
    updateObj[`${platform}.refreshToken`] = null;
    
    const user = await User.findByIdAndUpdate(req.user.id, updateObj, { new: true });
    
    res.json({ message: `${platform} account disconnected`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
