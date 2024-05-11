const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config()

const mongooseConnection = () => {
  mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(()=>console.log("Connected to MongoDB"))
  .catch((e)=>console.log("Couldn't connect to MongoDB\n"+e))
}

module.exports = mongooseConnection
