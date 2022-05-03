const authRoute = require("./auth");
const profileRoute = require("./profile");
const blogRoute = require("./blog");
const commentRoute = require("./comment");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.send({
      message: "First end point",
    });
  });

  app.use("/auth", authRoute);
  app.use("/profile", profileRoute);
  app.use("/blog", blogRoute);
  app.use("/blog", commentRoute);
};
