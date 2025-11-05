const mongoose = require("mongoose");

const SearchSchema = new mongoose.Schema(
  {
    // 🧑‍💻 Optional user (login नसला तरी search साठवू शकतो)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // 🔍 Search keyword
    term: { type: String, required: true, trim: true },

    // 🕒 Time of search
    timestamp: { type: Date, default: Date.now },
  },
  {
    collection: "searches",
  }
);

// 🧠 Index for faster aggregation (top searches)
SearchSchema.index({ term: 1 });
SearchSchema.index({ timestamp: -1 });

// 🧹 Prevent storing exact same term repeatedly for same user (optional)
SearchSchema.pre("save", async function (next) {
  try {
    const existing = await mongoose.model("Search").findOne({
      user: this.user,
      term: this.term,
    });
    if (existing) return next(false); // skip save
    next();
  } catch (err) {
    console.error("⚠️ Search pre-save error:", err.message);
    next();
  }
});

module.exports = mongoose.model("Search", SearchSchema);
