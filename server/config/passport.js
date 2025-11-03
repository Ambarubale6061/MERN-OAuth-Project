const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");
const { Strategy: CustomStrategy } = require("passport-custom"); // ✅ for dummy login

module.exports = function (passport) {
  // 🔹 Serialize user (store user id in session)
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 🔹 Deserialize user (fetch full user from DB)
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // 🔹 Helper function for creating/updating users from OAuth providers
  const upsertUser = async (profile, provider, done) => {
    try {
      const query = { oauthId: profile.id, oauthProvider: provider };
      const update = {
        name: profile.displayName || profile.username || "Unknown User",
        email: profile.emails?.[0]?.value || "",
        profilePic:
          profile.photos?.[0]?.value ||
          "https://cdn-icons-png.flaticon.com/512/9131/9131529.png",
        oauthProvider: provider,
      };

      let user = await User.findOne(query);
      if (!user) user = await User.create({ ...query, ...update });
      else await User.findByIdAndUpdate(user._id, update);
      done(null, user);
    } catch (err) {
      console.error(`❌ Passport upsert error (${provider}):`, err);
      done(err, null);
    }
  };

  // ✅ Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          "http://localhost:5000/api/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) =>
        upsertUser(profile, "google", done)
    )
  );

  // ✅ GitHub OAuth Strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL:
          process.env.GITHUB_CALLBACK_URL ||
          "http://localhost:5000/api/auth/github/callback",
        scope: ["user:email"],
      },
      (accessToken, refreshToken, profile, done) =>
        upsertUser(profile, "github", done)
    )
  );

  // ✅ Facebook OAuth Strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL:
          process.env.FACEBOOK_CALLBACK_URL ||
          "http://localhost:5000/api/auth/facebook/callback",
        profileFields: ["id", "displayName", "photos", "email"],
      },
      (accessToken, refreshToken, profile, done) =>
        upsertUser(profile, "facebook", done)
    )
  );

  // ✅ Dummy Strategy (for local/demo login)
  passport.use(
    "dummy",
    new CustomStrategy(async (req, done) => {
      try {
        const dummyData = {
          oauthId: "dummy-001",
          oauthProvider: "dummy",
          name: "Demo User",
          email: "demo@example.com",
          profilePic: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png",
        };

        let user = await User.findOne({
          oauthId: dummyData.oauthId,
          oauthProvider: "dummy",
        });

        if (!user) {
          user = await User.create(dummyData);
        }

        return done(null, user);
      } catch (err) {
        console.error("❌ Dummy login failed:", err);
        return done(err, null);
      }
    })
  );
};
