const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LikeSchema = new Schema(
  {
    blog_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Like = mongoose.model("Like", LikeSchema);
module.exports = Like;
