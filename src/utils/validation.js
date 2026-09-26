const validator = require("validator")

const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser")

const signUpValidation = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First Name or Last Name is needed")
  }
  else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!")
  }
  else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong!")
  }
}

const loginValidation = (req, res, next) => {
  const { emailId, password } = req.body;
  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!")
  }
  next()
}

const loginController = async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await loginService(emailId, password)

    const { _id } = user
    const token = await jwt.sign({ id: _id }, process.env.JWT_SECRET)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax"
    }
    )
    res.json({
      message: "Login successful"
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
}

const loginService = async (emailId, password) => {
  const existingUser = await User.findOne({ emailId })
  if (!existingUser) {
    throw new Error("User Not found");
  }
  const isPasswordValid = await bcrypt.compare(password, existingUser.password)
  if (!isPasswordValid) {
    throw new Error("Password is not valid");
  }
  return existingUser;

}

module.exports = { signUpValidation, loginValidation, loginController }
