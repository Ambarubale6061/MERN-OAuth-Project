const express = require('express');
const router = express.Router();
const Search = require('../models/Search');

function ensureAuth(req, res, next) {
  if (req.user) return next();
  return res.status(401).json({ error: 'Not authenticated' });
}

router.get('/history', ensureAuth, async (req, res) => {
  try {
    const docs = await Search.find({ user: req.user._id }).sort({ timestamp: -1 }).limit(200);
    const formatted = docs.map(d => ({ term: d.term, timestamp: d.timestamp }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
