const express = require("express")
const app = express()

app.use((req,res)=>{
  res.send("Hello Dada")
})
app.use("/hey",(req,res)=>{
  res.send("Hey Dada")
})

app.listen(3000,()=>{
  console.log("Server start successfully!")
})
