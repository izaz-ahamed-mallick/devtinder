const mongoose = require('mongoose')
const connectDB = async () => {
  return await mongoose.connect(
    process.env.DATABASE_URL
  )
}

module.exports = {
  connectDB
}
