const { Validator } = require("node-input-validator");
const Blog = require("../models/blog.model");
const Category = require("../models/category.model");
const Like = require("../models/like.model");

exports.createBlog = async (req, res) => {
  const v = new Validator(req.body, {
    title: "required|minLength:5|maxLength:100",
    description: "required",
    category: "required",
  });
  const matched = await v.check();
  if (!matched) {
    return res.status(422).send(v.errors);
  }
  const existingBlog = await Blog.findOne({ title: req.body.title });
  if (existingBlog) {
    return res.json({
      message: "Blog already exists",
    });
  }
  const newBlog = new Blog({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    created_by: req.user._id,
  });
  const blogData = await newBlog.save();

  res.status(201).json({
    status: "success",
    message: "blog created successfully",
    blogData,
  });
};

exports.blogList = async (req, res) => {
  let query = {};
  if (req.query.keyword) {
    query.$or = [{ title: { $regex: req.query.keyword, $options: "i" } }];
  }
  const blogs = await Blog.find(query)
    .populate("category")
    .populate("created_by");
  res.status(200).json({
    status: "success",
    message: "Bolog list",
    blogs,
  });
};

exports.getBlogById = async (req, res) => {
  try {
    if (!req.params.blog_id) {
      return res.json({
        message: "blog_id is required",
      });
    }
    const blog = await Blog.findOne({ _id: req.params.blog_id })
      .populate("category")
      .populate("created_by");
    res.status(200).json({
      status: "success",
      message: "Blog details",
      blog,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Error to find Blog details",
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog_id = req.params.blog_id;
    const blog = await Blog.findOne({ _id: blog_id });
    if (!blog) {
      return res.status(400).json({
        success: "failed",
        message: "Blog not found",
      });
    } else {
      let current_user = req.user;
      if (blog.created_by != current_user._id) {
        return res.status(400).json({
          status: "failed",
          message: "Access denied",
        });
      } else {
        const updatedBlog = await Blog.updateOne(
          { _id: blog_id },
          {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
          }
        );
        if (updatedBlog) {
          res.status(200).json({
            status: "success",
            message: "Blog updated successfully",
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog_id = req.params.blog_id;
    const blog = await Blog.findOne({ _id: blog_id });
    if (!blog) {
      return res.status(400).json({
        message: "Blog not found",
      });
    } else {
      await Blog.deleteOne({ _id: blog_id });
      res.status(200).json({
        status: "success",
        message: "Blog deleted successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.toggleLike = async (req, res) => {
  try {
    let blog_id = req.params.blog_id;
    const blog = await Blog.findOne({ _id: blog_id });
    if (!blog) {
      return res.status(400).json({
        message: "Blog not found",
      });
    } else {
      let current_user = req.user;
      const blogLikedByUser = await Like.findOne({
        blog_id: blog_id,
        user_id: current_user._id,
      });
      if (!blogLikedByUser) {
        const blogLike = await Like.create({
          blog_id: blog_id,
          user_id: current_user._id,
        });
        await Blog.updateOne(
          { _id: blog_id },
          { $push: { blog_likes: blogLike._id } }
        );
        if (blogLike) {
          res.status(201).json({
            status: "success",
            message: "Blog liked successfully",
          });
        }
      } else {
        await Like.deleteOne({
          _id: blogLikedByUser._id,
        });
        await Blog.updateOne(
          { _id: blogLikedByUser.blog_id },
          { $pull: { blog_likes: blogLikedByUser._id } }
        );
        res.status(201).json({
          status: "success",
          message: "Blog unliked successfully",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
