const Blog = require("../models/blogs");
const asyncHandler = require("../helpers/asyncHandler");
const ApiError = require("../helpers/ApiError");

// blogs index list controller
const blog_index = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json({ blogs });
});

// blog details controller
const blog_details = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  res.json({ blog });
});

// blog create post controller
const blog_create_post = asyncHandler(async (req, res) => {
  const blog = new Blog(req.body);
  const savedBlog = await blog.save();

  res.status(201).json({
    message: "Blog created successfully",
    blog: savedBlog,
  });
});

// blog delete controller
const blog_delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedBlog = await Blog.findByIdAndDelete(id);

  if (!deletedBlog) {
    throw new ApiError(404, "Blog not found");
  }

  res.json({
    message: "Blog deleted successfully",
    deletedBlog,
  });
});

module.exports = {
  blog_index,
  blog_details,
  blog_create_post,
  blog_delete,
};
