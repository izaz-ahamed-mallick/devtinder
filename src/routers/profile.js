const express = require("express");
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");

const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const { updatePasswordValidation, validationProfileEdit } = require("../utils/profileValidation");


profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user
    res.send({
      message: "User Profile fetched",
      data: user
    })
  } catch (error) {
    res.status(400).send({
      message: "Error fetching the data",
      error: error.message
    });
  }
})


profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validationProfileEdit(req)
    const loggedInUser = req.user;
    Object.assign(loggedInUser, req.body)
    await loggedInUser.save()
    const { password: _, ...userData } = loggedInUser.toObject()
    res.status(200).json({
      message: "Profile updated successfully",
      data: userData
    });
  } catch (error) {
    res.status(400).send({
      message: "Error updating the data",
      error: error.message
    });
  }
})

profileRouter.patch("/profile/updatePassword",userAuth,updatePasswordValidation, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId })
    const { oldPassword, newPassword } = req.body
    const isValid = await bcrypt.compare(oldPassword, user.password)
    if (!isValid) {
      throw new Error("Old password is not match")
    }
    const hashNewPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashNewPassword;
    await user.save()
res.send({message:"Password update successfull!!"})
  } catch (error) {
    res.status(400).send({
      message: "Error updating the data",
      error: error.message
    });
  }
})
module.exports = profileRouter;
