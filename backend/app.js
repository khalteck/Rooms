const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");
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

// API v1 routes
const apiV1 = express.Router();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Rooms API", version: "1.0.0" });
});

// auth routes
apiV1.use("/auth", authRoutes);

app.use("/api/v1", apiV1);

// Error handling - must be last
app.use(notFound);
app.use(errorHandler);

// Export the app for testing purposes
module.exports = app;
