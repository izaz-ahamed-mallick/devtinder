const express = require("express")
const app = express()

app.get("/user",(req,res)=>{
  res.send({name:"Tanish",address:"ujjalpukur"})
})


app.use(express.json());

app.post("/user", (req, res) => {
  console.log(req.body);
  res.json({
    message: "User saved successfully on DB",
    user: req.body
  });
});

app.put("/user",(req,res)=>{
  
  res.send("User update successfully " + req.query.name)
})

app.delete("/user/:id",(req,res)=>{
  res.send(`User delete successfully - ${req.params.id}`)
})

app.use("/",(req,res,next)=>{
 console.log("Home middleware");
  next()
})
app.use("/hey/2",(req,res)=>{
  res.send("Hey Dada 2")
})

app.use("/hey",(req,res)=>{
  res.send("Hey Dada")
})

app.use("/user/:name",(req,res)=>{
  res.send(`Hello-${req.params.name}`)
})


app.listen(3000,()=>{
  console.log("Server start successfully!")
})
