
const connectionRequest = require("../models/connectionRequesr");
const User = require("../models/user")
const mongoose = require("mongoose")

const requetValidation = async (req, res, next) => {
  const fromUserId = req.user._id;
  const toUserId = req.params.userId;
  const status = req.params.status;



  try {
    const ALLOWED_STATUS = ["ignored", "interested"]

    if (!ALLOWED_STATUS.includes(status)) {
      throw new Error("This status is not allowed")
    }


    if (fromUserId.toString() === toUserId) {
      throw new Error("Sending a connection request to yourself is not allowed");
    }


    const user = await User.findById(toUserId);
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      throw new Error("Invalid user ID");
    }
    if (!user) {
      throw new Error("User not found");
    }

    const existingConnectionRequest = await connectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    })

    if (existingConnectionRequest) {
      throw new Error("This connection request already exist")
    }
    next()
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
}

module.exports = requetValidation
