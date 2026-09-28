const jwt = require("jsonwebtoken");
const User = require("../models/user");


const authCheck = (req, res, next) => {
  console.log("do some auth")
  const token = "xyz";
  const isAuthorized = token === "xyz"
  if (isAuthorized) {
    next()
  } else {
    res.status(401).send("Unauthorize")
  }


}

const isAdminCheck = (req, res, next) => {
  console.log("pass the auth  now goes to home ")
  const user = "Admin"
  const isAdmin = user === "Admin"
  if (!isAdmin) {
    return res.status(401).send("User not admin")
  }
  next()
}


const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }
    console.log(token)
    const decoded = await jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists"
      });
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }

}

module.exports = {
  authCheck, isAdminCheck, userAuth
}
