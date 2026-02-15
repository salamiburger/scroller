const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint' });
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout endpoint' });
});

router.get('/profile', (req, res) => {
  res.json({ message: 'Get user profile' });
});

module.exports = router;
