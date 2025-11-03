const express = require('express');
const router = express.Router();
const Search = require('../models/Search');

// GET /api/top-searches - aggregated top 5 terms
router.get('/', async (req, res) => {
  try {
    const agg = await Search.aggregate([
      { $group: { _id: '$term', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { term: '$_id', count: 1, _id: 0 } },
    ]);
    res.json(agg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch top searches' });
  }
});

module.exports = router;
