const jwt = require("jsonwebtoken");

// exports.auth = (req, res, next) => {
//   const token = req.headers["authorization"];
//   if (!token) {
//     return res.status(401).json({
//       message: "Please login to continue",
//     });
//   } else {
//     try {
//       var decoded = jwt.verify(token, "mysecret");
//       if (decoded) {
//         req.user = decoded.data;
//         next
//       } else {
//         return res.status(401).json({
//           message: "Please login to continue",
//         });
//       }
//     } catch (error) {
//       if (error.expiredAt && error.expiredAt < new Date()) {
//         return res.status(401).json({
//           message: "session expired",
//         });
//       } else {
//         return res.status(401).json({
//           message: "Please login to continue",
//         });
//       }
//     }
//     next();
//   }
// };
exports.auth = (req, res, next) => {
  try {
    if (!req.headers.authorization) return next("Please login");
    const token =
      req.headers.authorization.split(" ")[1] || req.headers.authorization;
    const decoded = jwt.verify(token, "mysecret");
    req.user = decoded.user;
    next();
  } catch (err) {
    const error =
      err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
    return next(error);
  }
};
