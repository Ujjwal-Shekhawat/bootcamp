const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect woth Database
connectDB();

const bootcamps = require("./routes/bootcamps");
const { connect } = require("mongoose");

const app = express();

// Logging middleware (I'm using morgan as it is light weight and saves the trouble for writing my custom middleware)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount Routers
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
