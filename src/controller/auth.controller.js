
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const { loginService } = require('../utils/validation');
const User = require('../models/user');

const signUpController = async (req, res) => {

  try {
    //data validation
    const { firstName, lastName, emailId, password } = req.body
    const existingUser = await User.findOne({ emailId })
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists. Try a different email."
      });
    }
    //encryption
    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User(
      {
        firstName, lastName, emailId, password: passwordHash
      }
    )
    const resp = await user.save()
    const { password: _, ...userData } = resp.toObject();
    res.status(201).send({
      message: "Data added successfully",
      data: userData
    });
  } catch (err) {
    res.status(400).json({
      message: "Signup failed",
      error: error.message
    });
  }
}

const loginController = async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await loginService(emailId, password)

    const token = await user.getJWT()
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


module.exports = { loginController, signUpController }
