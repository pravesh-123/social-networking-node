const Comment = require("../models/comment.model");
const Blog = require("../models/blog.model");
exports.createComment = async (req, res) => {
  try {
    const blog_id = req.params.blog_id;
    const blog = await Blog.findOne({ _id: blog_id });
    if (!blog) {
      return res.status(400).json({ message: "No blog found" });
    }
    if (!req.body.comment) {
      return res.status(400).json({ message: "comment is required" });
    }
    const newComment = await Comment.create({
      comment: req.body.comment,
      blog_id,
      user_id: req.user._id,
    });
    await Blog.updateOne(
      { _id: blog_id },
      {
        $push: { blog_comments: newComment._id },
      }
    );
    if (newComment) {
      res.status(201).json({
        status: "success",
        message: "Comment added successfully",
        newComment,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getCommentList = async (req, res) => {
  try {
    const blog_id = req.params.blog_id;
    const blog = await Blog.findOne({ _id: blog_id });
    if (!blog) {
      return res.status(400).json({ message: "No blog found" });
    }
    const comments = await Comment.find({ blog_id })
      .populate("blog_id")
      .populate("user_id");
    if (comments) {
      res.status(200).json({
        status: "success",
        message: "Comment list",
        comments,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.updateComment = async (req, res) => {
  try {
    const comment_id = req.params.comment_id;
    const comment = await Comment.findOne({ _id: comment_id });
    if (!comment) {
      return res.status(400).json({
        message: "No comment found",
      });
    }
    let current_user = req.user;
    if (comment.user_id != current_user._id) {
      return res.status(400).json({
        message: "Access denied",
      });
    }
    const updatedComment = await Comment.updateOne(
      { _id: comment_id },
      {
        comment: req.body.comment,
      }
    );
    if (updatedComment) {
      res.status(200).json({
        status: "success",
        message: "Comment updated successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment_id = req.params.comment_id;
    const comment = await Comment.findOne({ _id: comment_id });
    if (!comment) {
      return res.status(400).json({
        message: "Comment not found",
      });
    } else {
      await Comment.deleteOne({ _id: comment_id });
      await Blog.updateOne(
        { _id: comment.blog_id },
        {
          $pull: { blog_comments: comment_id },
        }
      );
      res.status(200).json({
        status: "success",
        message: "Comment deleted successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
