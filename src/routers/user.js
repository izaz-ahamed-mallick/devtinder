const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const sendResponse = require("../utils/sendResponse.js")
const sendError = require("../utils/sendError.js")


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


userRouter.get(
  "/user/request/getAllRequest",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user._id;

      const requests = await ConnectionRequest.find({
        toUserId: loggedInUser,
        status: "interested",
      }).populate("fromUserId", [
        "firstName",
        "lastName",
        "gender",
        "skills",
        "about",
        "photoUrl",
        "age",
        "location",
        "linkedinUrl",
      ]);
      const data = requests.map((request) => ({
        requestId: request._id,
        status: request.status,
        createdAt: request.createdAt || request.updatedAt || "",
        user: request.fromUserId,
      }));
      return sendResponse(
        res,
        200,
        "Connection requests fetched successfully",
        data
      );
    } catch (error) {
      console.error("Error fetching connection requests:", error);

      return sendError(
        res,
        500,
        "Something went wrong while fetching connection requests"
      );
    }
  }
);


userRouter.get("/user/request/acceptedConnection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    const connection = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser, status: "accepted" },
        { fromUserId: loggedInUser, status: "accepted" }
      ],

    }).populate("fromUserId", ["firstName", "lastName", "gender", "skills"])
      .populate("toUserId", ["firstName", "lastName", "gender", "skills"]);

    const data = connection.map((user) => {
      return user.fromUserId._id.equals(loggedInUser) ? user.toUserId : user.fromUserId;
    })
    return sendResponse(
      res,
      200,
      "All accepted connection request fetch successfully",
      data
    );
  } catch (error) {
    return sendError(
      res,
      500,
      "Something went wrong while fetching connection requests"
    );
  }
})

userRouter.get("/user/request/rejectedUser", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id
    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser, status: "rejected"
    }).populate("fromUserId", ["firstName", "lastName", "photoUrl"])

    const data = requests.map((request) => ({
      requestId: request._id,
      status: request.status,
      createdAt: request.createdAt || request.updatedAt || "",
      user: request.fromUserId,
    }));

    return sendResponse(
      res,
      200,
      "Rejected users fetched successfully",
      data
    );
  } catch (error) {
    console.error("Error fetching connection requests:", error);

    return sendError(
      res,
      500,
      "Something went wrong while fetching connection requests"
    );

  }
})

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit
    const loggedInUser = req.user._id;
    const connection = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser },
        { toUserId: loggedInUser }
      ]
    }).select("fromUserId toUserId")
    const hideUser = new Set()
    connection.forEach((req) => {
      hideUser.add(req.fromUserId.toString())
      hideUser.add(req.toUserId.toString())
    })
    const profileFeed = await User.find({
      _id: { $nin: Array.from(hideUser) }
    }).select("firstName lastName age gender about skills photoUrl location githubUrl linkedinUrl")
      .skip(skip)
      .limit(limit)

console.log(connection)
    return sendResponse(
      res,
      200,
      "Profile feed fetched successfully",
      profileFeed
    );
  } catch (error) {
    return sendError(
      res,
      500,
      "Something went wrong while fetching connection requests"
    );
  }
})

module.exports = userRouter;
