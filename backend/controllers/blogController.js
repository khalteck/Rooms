const Blog = require("../models/blogs");

// blogs index list controller
const blog_index = (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.json({ blogs: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch blogs" });
    });
};

//blog details contoller
const blog_details = (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ error: "Blog not found" });
      }
      res.json({ blog: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ error: "Blog not found" });
    });
};

// blog create post controller
const blog_create_post = (req, res) => {
  const blog = new Blog(req.body);
  blog
    .save()
    .then((result) => {
      res
        .status(201)
        .json({ message: "Blog created successfully", blog: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ error: "Failed to create blog" });
    });
};

// blog delete controller
const blog_delete = (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ error: "Blog not found" });
      }
      res.json({ message: "Blog deleted successfully", deletedBlog: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to delete blog" });
    });
};

module.exports = {
  blog_index,
  blog_details,
  blog_create_post,
  blog_delete,
};
