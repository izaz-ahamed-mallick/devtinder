const validator = require("validator")

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

const loginValidation = (req) => {
  const { emailId, password } = req.body;
  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!")
  }
}

module.exports = { signUpValidation, loginValidation }
