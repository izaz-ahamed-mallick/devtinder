const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxLength: 50,
    minLength: 4
  },
  lastName: {
    type: String,
    maxLength: 50,
    minLength: 4
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email address" + " " + value)
      }
    }
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Pasword is not strong" + " " + value)
      }
    }
  },
  age: {
    type: Number
  },
  gender: {
    type: String
  },
  about: {
    type: String,
    default: "This is the default about "
  },
  skills: {
    type: [String]
  }

})

const User = mongoose.model("User", userSchema);

module.exports = User;
