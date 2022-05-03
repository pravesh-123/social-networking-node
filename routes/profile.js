const router = require("express").Router();
const profileController = require("../controllers/profile.controller");
const { auth } = require("../helpers/middleware");

router.get("/current-user", auth, profileController.currentUser);

module.exports = router;
