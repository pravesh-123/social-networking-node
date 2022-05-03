const router = require("express").Router();
const commentController = require("../controllers/comment.controller");
const { auth } = require("../helpers/middleware");

router.post("/:blog_id/comments/create", auth, commentController.createComment);
router.get("/:blog_id/comments", auth, commentController.getCommentList);
router.put(
  "/comments/:comment_id/update",
  auth,
  commentController.updateComment
);

router.delete(
  "/comments/:comment_id/delete",
  auth,
  commentController.deleteComment
);

module.exports = router;
