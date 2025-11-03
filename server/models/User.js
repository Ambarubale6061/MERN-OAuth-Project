const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    oauthId: {
      type: String,
      required: true,
      index: true, // Faster lookups
    },
    oauthProvider: {
      type: String,
      required: true,
      enum: ["google", "github", "facebook", "dummy"], // ✅ Added "dummy" provider
    },
    name: {
      type: String,
      trim: true,
      default: "Unnamed User",
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },
    profilePic: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png", // ✅ Safe fallback image
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// ✅ Ensure unique user per provider + oauthId
UserSchema.index({ oauthId: 1, oauthProvider: 1 }, { unique: true });

// ✅ Fix for duplicate key errors (optional safety)
UserSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("User already exists for this OAuth provider."));
  } else {
    next(error);
  }
});

module.exports = mongoose.model("User", UserSchema);
