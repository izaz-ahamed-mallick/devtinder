const mongoose = require('mongoose')
const connectDB = async ()=>{
 return await mongoose.connect(
    'mongodb+srv://izazahamedmallick98_db_user:Sujan8569@namastenode.lmvete5.mongodb.net/DevTinder'
  )
}

module.exports={
  connectDB
}
