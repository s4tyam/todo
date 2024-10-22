const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const url = process.env.mongo_connection_string;
  try {
    const cnn = await mongoose.connect(url);
    console.log(`Database connected to ${cnn.connection.host}`);
  } catch (err) {
    console.log(err.message);
    console.log("hi");
    process.exit();
  }
};

module.exports = connectDB;
