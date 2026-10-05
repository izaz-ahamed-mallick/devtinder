const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
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
    res.status(400).send("Somethi ng went wrong!")
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


userRouter.get("/user/request/getAllPendingRequest", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const data = await ConnectionRequest.find({
      toUserId: loggedInUser,
      status: "interested"
    }).populate("fromUserId", ["firstName", "lastName", "gender", "skills"])

    res.json({
      messaage: "All pending connection request fetch successfully",
      data
    })
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong",
      error: error.message
    })
  }
})

userRouter.get("/user/request/acceptedConnection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    const data = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser, status: "accepted" },
        { fromUserId: loggedInUser, status: "accepted" }
      ],

    }).populate("fromUserId", ["firstName", "lastName", "gender", "skills"])
      .populate("toUserId", ["firstName", "lastName", "gender", "skills"]);

    const connection = data.map((user) => {
      return user.fromUserId._id.equals(loggedInUser) ? user.toUserId : user.fromUserId;
    })
    res.json({
      messaage: "All accepted connection request fetch successfully",
      connection,
      loggedInUser
    })
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong",
      error: error.message
    })
  }
})

module.exports = userRouter;
