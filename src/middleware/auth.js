const authCheck= (req,res,next)=>{
  console.log("do some auth")
  const token = "xyz";
  const isAuthorized = token==="xyz"
  if(isAuthorized){
      next()
  }else{
    res.status(401).send("Unauthorize")
  }


}

const isAdminCheck=(req,res,next)=>{
  console.log("pass the auth  now goes to home ")
  const user= "Admin"
  const isAdmin = user ==="Admin"
  if(!isAdmin){
    return res.status(401).send("User not admin")
  }
next()
}

module.exports={
  authCheck,isAdminCheck
}
