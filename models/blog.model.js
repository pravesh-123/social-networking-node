const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: String,
    description: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    blog_comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    blog_likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
