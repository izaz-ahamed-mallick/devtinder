const express = require("express");
const requetValidation = require("../utils/requestValidation");
const connectionRequestModel = require("../models/connectionRequesr");
const { userAuth } = require("../middleware/auth");

const requestRouter = express.Router()

requestRouter.post("/sendConnectionRequest/:status/:userId", userAuth, requetValidation, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { userId: toUserId, status } = req.params;
    const sendingRequest = new connectionRequestModel({
      fromUserId, toUserId, status
    })
    const sendingData = await sendingRequest.save()

    res.status(201).json({
      message: `Connection request ${status} successfully`,
      data: sendingData
    })

  } catch (error) {
    res.status(400).send({
      message: "Error while sending request" + error.message
    }
    )
  }
})

module.exports = {
  requestRouter
}
