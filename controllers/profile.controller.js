exports.currentUser = (req, res) => {
  res.status(200).json({
    message: "Current user data",
    data: req.user,
  });
};
