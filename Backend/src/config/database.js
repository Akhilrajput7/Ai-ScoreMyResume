const mongoose = require("mongoose");

require("dotenv").config();

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    console.log("Db connection successfully");
  } catch (error) {
    console.log("db connection failed");
    console.log(error);
  }
}

module.exports = connectToDb;
