const express = require("express");
const User = require("../models/user");
const userRouter = express.Router();



userRouter.get("/getUserByEmail", async (req, res) => {
  try {
    const emailId = req.body.emailId
    const data = await User.findOne({ emailId })
    if (!data) {
      return res.status(404).send("User not found!");
    }
    res.send(data)
  } catch (error) {
    res.status(400).send("Something went wrong!")
  }
})

userRouter.get("/getAllUser", async (req, res) => {
  try {
    const data = await User.find({})
    if (data.length == 0) {
      res.status(400).send("User not found!")
    } else {
      res.send(data)
    }
  } catch (error) {
    res.status(500).send("Something went wrong")
  }
})


userRouter.delete("/deleteUser", async (req, res) => {

  try {
    const userId = req.body?.userId;

    console.log("userId:", userId);

    const resp = await User.findByIdAndDelete(userId);

    console.log("Deleted user:", resp);

    if (!resp) {
      return res.status(404).send("User not found!");
    }

    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Something went wrong!")
  }
})

userRouter.patch('/updateUser/:userId', async (req, res) => {
  try {
    const userId = req.params.userId
    const updateData = req.body
    const ALLOWED_UPDATE = ["firstName", "lastName", "age", "gender", "about", "skills"]
    const invalidKeys = Object.keys(updateData).filter(key => !ALLOWED_UPDATE.includes(key))
    if (invalidKeys.length > 0) {
      throw new Error(`These fields cannot be updated: ${invalidKeys.join(", ")}`);
    }
    const resp = await User.findByIdAndUpdate(userId, updateData, { returnDocument: "after" })
    if (!resp) {
      return res.status(400).send("user not found")
    }
    res.send({
      message: "User update successfully",
      data: resp
    })
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong",
      error: error.message
    })
  }
})

module.exports = userRouter;
