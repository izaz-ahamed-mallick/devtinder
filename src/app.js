require("dotenv").config();

const express = require("express")
const app = express()
const { connectDB } = require("./config/database")
const User = require("./models/user")
const { signUpValidation, loginValidation } = require("./utils/validation")

const cookieParser = require("cookie-parser");
const { userAuth } = require("./middleware/auth");

const { loginController, signUpController } = require("./controller/auth.controller")
app.use(express.json())
app.use(cookieParser())



app.post('/signup', signUpValidation, signUpController)

app.post("/login", loginValidation, loginController)

app.get("/profile", userAuth, async (req, res) => {
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

app.get("/getUserByEmail", async (req, res) => {
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

app.get("/getAllUser", async (req, res) => {
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


app.delete("/deleteUser", async (req, res) => {

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

app.patch('/updateUser/:userId', async (req, res) => {
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



connectDB().then((connection) => {
  console.log("Database connection is established...");

  app.listen(3001, () => {
    console.log("Server start successfully!");
  });
}).catch((err) => {
  console.error("Database cannot be connected!");
  console.error(err);
});
