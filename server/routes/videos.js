const express = require('express');
const router = express.Router();

router.get('/random', async (req, res) => {
  try {
    const Video = require('../models/Video');
    const count = await Video.countDocuments();
    const random = Math.floor(Math.random() * count);
    const video = await Video.findOne().skip(random);
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:source', async (req, res) => {
  try {
    const Video = require('../models/Video');
    const videos = await Video.find({ source: req.params.source }).limit(10);
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
