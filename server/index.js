require("dotenv").config();
const startJobs = require("./Jobs/start");
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_CONNECT);

let ejs = require("ejs");

const port = process.env.PORT || 4000;

const express = require("express");
const cors = require("cors");
const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

// ✅ Allowed origins
const allowedOrigins = [
  "http://192.168.1.37:5173",
  "http://localhost:5173",
  "http://172.30.32.1:5173",
  "https://invezzahrms.shub.space",
  "https://engineinv.vercel.app",
  "https://www.hrmsdev.invezzatech.com",
  "https://hrmsdev.invezzatech.com"
];

// ✅ CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS", // ✅ Fixed typo (methods)
  credentials: true,
  allowedHeaders: "Content-Type, Authorization" // ✅ Ensure headers are allowed
};

// ✅ Apply CORS middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"));

// ✅ Handle preflight (OPTIONS) requests
app.options("*", cors(corsOptions));

// Admin routes
const adminRoute = require("./routes/adminRoute");
app.use("/api/admin", adminRoute);

// Main employee login routes
const authRoute = require("./routes/authRoute");
app.use("/api", authRoute);

// Common routes
const commonRoute = require("./routes/commonRoute");
app.use("/api", commonRoute);

// ✅ Start server
app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
  startJobs();
});
