const express = require("express")
const { authCheck, isAdminCheck } = require("./middleware/auth")
const app = express()
const { connectDB } = require("./config/database")
const User = require("./models/user")


app.use(express.json())
app.post('/signup', async (req, res) => {
  const data = req.body
  const user = new User(data)
 try{
   const resp = await user.save()
  res.send({
    message: "Data Added successfully",
    data: resp
  })
 }catch(err){
  res.status(400).send("Error while saving the data", + err.message)
 }
})














connectDB().then((connection) => {
  console.log("Database connection is established...")
  app.listen(3000, () => {
    console.log("Server start successfully!")
  })
}).catch((err) => {
  console.error("Database cannnot be connected!!")
})
