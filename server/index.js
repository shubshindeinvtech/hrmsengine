require("dotenv").config();
const startJobs = require("./Jobs/start");
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_CONNECT);

// mongoose.connect("mongodb://localhost:27017/invhrms");

let ejs = require("ejs");

const port = 4000;

const express = require("express");
const cors = require("cors");
const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

const allowedOrigins = ['*'];

const corsOptions = {
  origin: "http://www.hrmsdev.invezzatech.com/register",
  methodS: "GET, POST, PUT, DELETE, PATCH, HEAD",
  allowedOrigins: ['Content-type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.static("public"));

//admin routes
const adminRoute = require("./routes/adminRoute");
app.use("/api/admin", adminRoute);

//main emp loging routes
const authRoute = require("./routes/authRoute");
app.use("/api", authRoute);

//common routes
const commonRoute = require("./routes/commonRoute");
app.use("/api", commonRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is works on port http://localhost:${process.env.PORT}`);
  startJobs();
});
