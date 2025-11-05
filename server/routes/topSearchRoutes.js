const express = require("express");
const router = express.Router();
const Search = require("../models/Search");

// 🧠 Optional in-memory cache to avoid heavy DB load (resets every few mins)
let cache = { data: null, timestamp: 0 };

// GET /api/top-searches - top 5 most frequent terms (case-insensitive)
router.get("/", async (req, res) => {
  try {
    // Use cache if data < 2 minutes old
    const now = Date.now();
    if (cache.data && now - cache.timestamp < 120000) {
      return res.json({ cached: true, topSearches: cache.data });
    }

    const agg = await Search.aggregate([
      {
        $group: {
          _id: { $toLower: "$term" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $project: {
          term: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Save cache
    cache = { data: agg, timestamp: now };

    res.json({ cached: false, topSearches: agg });
  } catch (err) {
    console.error("❌ Top searches error:", err);
    res.status(500).json({ error: "Failed to fetch top searches" });
  }
});

module.exports = router;
