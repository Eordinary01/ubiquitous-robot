const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://ubiquitous-robot-zeta.vercel.app",
    "https://ubiquitous-robot-h2ed.vercel.app",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  next();
});
app.use(express.json());

// Serverless-friendly cached MongoDB connection handler (Vercel / Lambda)
let connectPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not defined in environment");
  }

  if (!connectPromise || mongoose.connection.readyState === 0) {
    connectPromise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      })
      .catch((err) => {
        connectPromise = null;
        throw err;
      });
  }

  return await connectPromise;
};

// Ensure DB is connected before processing API requests (essential for Vercel/serverless cold starts)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection error in request handler:", err.message);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: err.message,
    });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome Dev!!" });
});

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/join", require("./routes/joinRoutes"));
app.use("/members", require("./routes/memberRoutes"));
app.use("/gyms", require("./routes/gymRoutes"));

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

module.exports = app;
