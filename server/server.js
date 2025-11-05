require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Connect MongoDB
connectDB();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ✅ MongoDB Session Store
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

// ✅ Passport Setup
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/historyRoutes"));
app.use("/api/top-searches", require("./routes/topSearchRoutes"));

// ✅ Unsplash Search Route (added here)
app.post("/api/search", async (req, res) => {
  const { term } = req.body;
  if (!term) {
    return res.status(400).json({ message: "Search term is required" });
  }

  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query: term,
        per_page: 20,
      },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    // Optionally store search in MongoDB (user + term)
    // You can expand this part if your Search model exists

    res.json({
      term,
      total: response.data.total,
      results: response.data.results,
    });
  } catch (error) {
    console.error("❌ Unsplash API Error:", error.message);
    res.status(500).json({ message: "Error fetching images from Unsplash" });
  }
});

// ✅ Root
app.get("/", (req, res) => {
  res.send("✅ Unsplash Image Search Server Running Successfully!");
});

// ✅ Start Server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
