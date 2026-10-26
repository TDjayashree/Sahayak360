const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sahayak';
  try {
    // Set short timeout so server starts instantly without freezing if mongod is not running
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[Database] MongoDB Connected: ${mongoose.connection.host}`);
    return true;
  } catch (error) {
    console.log(`[Database] Local MongoDB daemon not active (${error.message}). Running with persistent High-Performance JSON Storage Engine.`);
    return false;
  }
};

module.exports = connectDB;
