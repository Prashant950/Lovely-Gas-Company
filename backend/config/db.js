// config/db.js - MongoDB connection helper
const mongoose = require('mongoose');

// Connect to MongoDB using the URI from the environment.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    // Cannot run without a database, so exit the process.
    process.exit(1);
  }
};

module.exports = connectDB;
