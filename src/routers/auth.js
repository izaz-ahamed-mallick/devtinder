const express = require("express");
const { signUpValidation, loginValidation } = require("../utils/validation");
const { signUpController, loginController } = require("../controller/auth.controller");
const authRouter = express.Router();

authRouter.post('/signup', signUpValidation, signUpController)

authRouter.post("/login", loginValidation, loginController)

module.exports = authRouter
