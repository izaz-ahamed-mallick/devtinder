const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

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
    type: String,
    enum: {
      values: ["male", "female", "other"],
      message: props => `${props.value} is not a valid gender`
    }
  },
  about: {
    type: String,
    default: "This is the default about "
  },
  skills: {
    type: [String]
  },
  photoUrl:{
    type:String
  }

}, { timestamps: true })

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  return token;

}

userSchema.methods.validatiorPassword = async function (paswordByUserInput) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(paswordByUserInput, user.password);
  return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = User;
