const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");

// 🔹 Google Login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: true,
  }),
  (req, res) => res.redirect(`${process.env.CLIENT_URL}/`)
);

// 🔹 GitHub Login
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: true,
  }),
  (req, res) => res.redirect(`${process.env.CLIENT_URL}/`)
);

// 🔹 Facebook Login
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: true,
  }),
  (req, res) => res.redirect(`${process.env.CLIENT_URL}/`)
);

// ✅ DUMMY LOGIN (NEW)
router.get("/dummy", async (req, res) => {
  try {
    const dummyUser = {
      oauthId: "dummy-001",
      oauthProvider: "dummy",
      name: "Demo User",
      email: "demo@example.com",
      profilePic: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png",
    };

    let user = await User.findOne({ oauthId: dummyUser.oauthId });
    if (!user) {
      user = await User.create(dummyUser);
    }

    req.login(user, (err) => {
      if (err) throw err;
      res.redirect(`${process.env.CLIENT_URL}/`);
    });
  } catch (error) {
    console.error("Dummy login failed:", error);
    res.status(500).json({ error: "Dummy login failed" });
  }
});

// 🔹 Logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid", { path: "/" });
      res.json({ ok: true, message: "Logged out successfully" });
    });
  });
});

// 🔹 Current user
router.get("/user", (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  const { _id, name, email, profilePic, oauthProvider } = req.user;
  res.json({ _id, name, email, profilePic, oauthProvider });
});

module.exports = router;
