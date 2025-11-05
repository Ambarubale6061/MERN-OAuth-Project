const express = require("express");
const router = express.Router();
const Search = require("../models/Search");

// Middleware to check auth (with optional public mode)
function ensureAuth(req, res, next) {
  if (process.env.PUBLIC_SEARCH === "true") return next();
  if (req.user) return next();
  return res.status(401).json({ error: "Not authenticated" });
}

/**
 * @route GET /api/history
 * @desc Get logged-in user's search history (or public if PUBLIC_SEARCH=true)
 * @access Private (or public mode)
 */
router.get("/history", ensureAuth, async (req, res) => {
  try {
    let filter = {};
    if (req.user && req.user._id) {
      filter.user = req.user._id;
    } else if (process.env.PUBLIC_SEARCH !== "true") {
      return res.status(401).json({ error: "Login required to view history" });
    }

    const limit = parseInt(req.query.limit) || 50;

    const docs = await Search.find(filter).sort({ timestamp: -1 }).limit(limit);

    const formatted = docs.map((d) => ({
      term: d.term,
      timestamp: d.timestamp,
      timeAgo: timeAgo(d.timestamp),
    }));

    res.json({ count: formatted.length, history: formatted });
  } catch (err) {
    console.error("❌ History fetch error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// Small helper to format relative time
function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
  };
  for (let key in intervals) {
    const v = Math.floor(seconds / intervals[key]);
    if (v >= 1) return `${v} ${key}${v > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

module.exports = router;
