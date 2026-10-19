const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        message: "Authentication required! Please log in.",
      });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
      .select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists"
      });
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Your session has expired. Please log in again.",
      });
    }

    return res.status(401).json({
      message: "Invalid authentication token. Please log in again.",
    });
  }

}

module.exports = {
  userAuth
}
