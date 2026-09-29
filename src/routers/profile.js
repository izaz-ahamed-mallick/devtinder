const express = require("express");
const { userAuth } = require("../middleware/auth");
const profileRouter = express.Router();


profileRouter.get("/profile", userAuth, async (req, res) => {
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
module.exports = profileRouter;
