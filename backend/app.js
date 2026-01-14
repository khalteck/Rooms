const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
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

// register view engine
app.set("view engine", "ejs");

// middleware & static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About Us" });
});

// blog routes
app.use("/blogs", blogRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404 - Page Not Found" });
});

// Export the app for testing purposes
module.exports = app;
