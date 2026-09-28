const validator = require("validator")

const User = require("../models/user")
const bcrypt = require("bcrypt")


const signUpValidation = (req, res, next) => {
  try {
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
    next()
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
}

const loginValidation = (req, res, next) => {
  const { emailId, password } = req.body;
  if (!validator.isEmail(emailId) || !password) {
    throw new Error("Email is not valid or password is invalid")
  }
  next()
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

module.exports = { signUpValidation, loginValidation ,loginService}
