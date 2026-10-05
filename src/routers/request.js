const express = require("express");

const { userAuth } = require("../middleware/auth");
const { requetValidation, connectionRequestValidation } = require("../utils/requestValidation");
const ConnectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router()

requestRouter.post("/connectionRequest/:status/:userId", userAuth, requetValidation, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { userId: toUserId, status } = req.params;
    const sendingRequest = new ConnectionRequest({
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

requestRouter.patch("/connectionRequest/:status/:requestId", userAuth, connectionRequestValidation, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { status, requestId } = req.params;

    const isValidRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUserId,
      status: "interested"
    })
    if (!isValidRequest) {
     return res.status(400).json({
        message: "This connection request is not valid"
      })
    }
    isValidRequest.status = status;
    const data = await isValidRequest.save()
    return res.status(201).json({
      message: "Connection request is update successfully",
      data: data
    })
  } catch (error) {
  res.status(400).json({
  message:"Error while update connection request",
  error:error.message
  
})
  }
})

module.exports = {
  requestRouter
}
