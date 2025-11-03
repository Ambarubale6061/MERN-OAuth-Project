require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();
// NOTE: use same default port as your frontend expectations (5001 used earlier)
const PORT = process.env.PORT || 5001;

// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Session (must be before passport.initialize/session and before routes that depend on session)
const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!mongoURI) {
  console.error("❌ Missing MongoDB connection string in .env file!");
  process.exit(1);
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoURI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// Passport setup (after session)
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes (register after passport + session)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/searchRoutes"));
app.use("/api", require("./routes/historyRoutes"));
app.use("/api/top-searches", require("./routes/topSearchRoutes"));

// Shortcut for older frontend linking (optional)
app.get("/auth/google", (req, res) => {
  res.redirect("/api/auth/google");
});

// Root
app.get("/", (req, res) => {
  res.send("✅ Unsplash Image Search Server Running Successfully!");
});

// Start
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
