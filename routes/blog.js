const router = require("express").Router();
const blogController = require("../controllers/blog.controller");
const { auth } = require("../helpers/middleware");

router.post("/create-blog", auth, blogController.createBlog);
router.get("/", auth, blogController.blogList);
router.get("/:blog_id", auth, blogController.getBlogById);
router.put("/:blog_id/update", auth, blogController.updateBlog);
router.delete("/:blog_id/delete", auth, blogController.deleteBlog);
router.post("/:blog_id/toggle-like", auth, blogController.toggleLike);

module.exports = router;
