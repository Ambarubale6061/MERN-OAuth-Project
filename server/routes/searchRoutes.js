const express = require("express");
const router = express.Router();
const axios = require("axios");
const Search = require("../models/Search");

// allow public search for quick testing by setting PUBLIC_SEARCH=true in .env
function ensureAuth(req, res, next) {
  if (process.env.PUBLIC_SEARCH === "true") return next();
  if (req.user) return next();
  return res.status(401).json({ error: "Not authenticated" });
}

// GET /api/search?query=flowers
router.get("/search", ensureAuth, async (req, res) => {
  try {
    const query = (req.query.query || "").trim();
    if (!query) return res.status(400).json({ error: "Search term required" });

    console.log("🔍 Searching Unsplash for:", query);

    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query, per_page: 20 },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
      timeout: 10000,
    });

    console.log(
      "📸 Unsplash returned:",
      (response.data.results || []).length,
      "items"
    );

    const results = (response.data.results || []).map((img) => ({
      id: img.id,
      thumb: img.urls.small,
      full: img.urls.full,
      alt: img.alt_description || img.description || "No description",
      width: img.width,
      height: img.height,
      link: img.links.html,
      photographer: img.user?.name || "",
    }));

    // Save term if user present (non-blocking)
    if (req.user && req.user._id) {
      try {
        await Search.create({ user: req.user._id, term: query });
      } catch (e) {
        console.warn("Could not save search term:", e.message || e);
      }
    }

    res.json({ total: response.data.total || 0, results });
  } catch (err) {
    console.error("❌ Unsplash API error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    res.status(500).json({
      error: "Image search failed",
      detail: err.response?.data || err.message,
    });
  }
});

// top-searches unchanged
router.get("/top-searches", async (req, res) => {
  try {
    const agg = await Search.aggregate([
      { $group: { _id: "$term", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { term: "$_id", count: 1, _id: 0 } },
    ]);
    res.json(agg);
  } catch (err) {
    console.error("❌ Top searches error:", err);
    res.status(500).json({ error: "Failed to fetch top searches" });
  }
});

module.exports = router;
