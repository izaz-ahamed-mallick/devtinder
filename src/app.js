require("dotenv").config();

const express = require("express")
const app = express()
const { connectDB } = require("./config/database")

const cookieParser = require("cookie-parser");

const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const userRouter = require("./routers/user");
app.use(express.json())
app.use(cookieParser())

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",userRouter)



connectDB().then((connection) => {
  console.log("Database connection is established...");

  app.listen(3001, () => {
    console.log("Server start successfully!");
  });
}).catch((err) => {
  console.error("Database cannot be connected!");
  console.error(err);
});
