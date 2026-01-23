const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const blogRoutes = require("./routes/blogRoutes");
require("dotenv").config();

const app = express();

// connect to mongoDB
const dbURI = process.env.DB_URI;
mongoose
  .connect(dbURI)
  .then((result) => {
    console.log(`connected to db, listening on port ${process.env.PORT}`);
    app.listen(process.env.PORT);
  })
  .catch((err) => console.log(err));

// middleware & static files
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Rooms API", version: "1.0.0" });
});

// blog routes
app.use("/blogs", blogRoutes);

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json({
      error: "Not Found",
      message: "The requested resource was not found",
    });
});

// Export the app for testing purposes
module.exports = app;
