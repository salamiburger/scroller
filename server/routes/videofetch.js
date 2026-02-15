const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const User = require('../models/User');
const axios = require('axios');

// Middleware to check if user is authenticated
const auth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
};

// Get random video from connected accounts
router.get('/random', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Build query for connected platforms
    const connectedPlatforms = [];
    if (user.youtube.connected) connectedPlatforms.push('youtube');
    if (user.facebook.connected) connectedPlatforms.push('facebook');
    if (user.instagram.connected) connectedPlatforms.push('instagram');
    if (user.tiktok.connected) connectedPlatforms.push('tiktok');
    
    if (connectedPlatforms.length === 0) {
      return res.status(400).json({ error: 'No accounts connected' });
    }
    
    const count = await Video.countDocuments({
      userId: req.user.id,
      source: { $in: connectedPlatforms }
    });
    
    if (count === 0) {
      return res.json(null); // No videos yet
    }
    
    const random = Math.floor(Math.random() * count);
    const video = await Video.findOne({
      userId: req.user.id,
      source: { $in: connectedPlatforms }
    }).skip(random);
    
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get videos by source
router.get('/:source', auth, async (req, res) => {
  try {
    const { source } = req.params;
    const user = await User.findById(req.user.id);
    
    // Check if user has this account connected
    const platformKey = source.toLowerCase();
    if (!user[platformKey]?.connected) {
      return res.status(403).json({ error: `${source} account not connected` });
    }
    
    const videos = await Video.find({
      userId: req.user.id,
      source: source
    }).limit(20);
    
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch videos from YouTube
async function fetchYouTubeVideos(userId, accessToken) {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        forMine: true,
        maxResults: 10,
        type: 'video',
        videoDuration: 'short',
        access_token: accessToken
      }
    });
    
    const videos = response.data.items.map(item => ({
      videoId: item.id.videoId,
      source: 'youtube',
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      creator: item.snippet.channelTitle,
      userId: userId
    }));
    
    return videos;
  } catch (err) {
    console.error('YouTube fetch error:', err.message);
    return [];
  }
}

// Fetch videos from TikTok (note: official API is limited)
async function fetchTikTokVideos(userId, accessToken) {
  try {
    // This is a placeholder - TikTok API access is restricted
    // In production, you'd need to implement proper TikTok OAuth
    return [];
  } catch (err) {
    console.error('TikTok fetch error:', err.message);
    return [];
  }
}

// Fetch videos from Instagram
async function fetchInstagramVideos(userId, accessToken) {
  try {
    // Instagram only allows fetching your own recent media
    const response = await axios.get(`https://graph.instagram.com/me/media`, {
      params: {
        fields: 'id,caption,media_type,media_url,timestamp',
        access_token: accessToken
      }
    });
    
    const videos = response.data.data
      .filter(item => item.media_type === 'VIDEO')
      .map(item => ({
        videoId: item.id,
        source: 'instagram',
        title: item.caption?.substring(0, 100) || 'Instagram Video',
        description: item.caption || '',
        thumbnail: item.media_url,
        creator: 'You',
        userId: userId
      }));
    
    return videos;
  } catch (err) {
    console.error('Instagram fetch error:', err.message);
    return [];
  }
}

// Fetch videos from Facebook
async function fetchFacebookVideos(userId, accessToken) {
  try {
    const response = await axios.get(`https://graph.facebook.com/me/videos`, {
      params: {
        fields: 'id,story,source,created_time',
        access_token: accessToken
      }
    });
    
    const videos = response.data.data.map(item => ({
      videoId: item.id,
      source: 'facebook',
      title: item.story || 'Facebook Video',
      description: '',
      url: item.source,
      creator: 'You',
      userId: userId
    }));
    
    return videos;
  } catch (err) {
    console.error('Facebook fetch error:', err.message);
    return [];
  }
}

// Trigger video fetch for all connected platforms
router.post('/fetch', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const allVideos = [];
    
    // Fetch from YouTube
    if (user.youtube.connected && user.youtube.accessToken) {
      const youtubeVideos = await fetchYouTubeVideos(req.user.id, user.youtube.accessToken);
      allVideos.push(...youtubeVideos);
    }
    
    // Fetch from Instagram
    if (user.instagram.connected && user.instagram.accessToken) {
      const instagramVideos = await fetchInstagramVideos(req.user.id, user.instagram.accessToken);
      allVideos.push(...instagramVideos);
    }
    
    // Fetch from Facebook
    if (user.facebook.connected && user.facebook.accessToken) {
      const facebookVideos = await fetchFacebookVideos(req.user.id, user.facebook.accessToken);
      allVideos.push(...facebookVideos);
    }
    
    // Save videos to database (avoid duplicates)
    for (const video of allVideos) {
      await Video.updateOne(
        { videoId: video.videoId, userId: req.user.id },
        video,
        { upsert: true }
      );
    }
    
    await User.findByIdAndUpdate(req.user.id, { lastVideoFetch: new Date() });
    
    res.json({ message: `Fetched ${allVideos.length} videos`, videos: allVideos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
