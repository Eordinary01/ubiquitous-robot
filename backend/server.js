const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// app.use(cors());

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
  origin: ['http://localhost:3000'],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  // console.log('Request Origin:', req.headers.origin);
  next();
});
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection Established successfully..");
  })
  .catch((err) => {
    console.error("Error connecting tot the database:", err);
  });

app.get("/", (req, res) => {
  res.json({ message: "Welcome Dev!!" });
});

//routes

app.use("/auth",require("./routes/authRoutes"));
app.use('/join', require('./routes/joinRoutes'));
app.use('/members', require('./routes/memberRoutes'));
app.use('/gyms',require('./routes/gymRoutes'));




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

