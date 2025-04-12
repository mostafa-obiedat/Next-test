import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(" Connected to MongoDB");
  } catch (error) {
    console.error(" MongoDB connection failed:", error.message);
  }
}

module.exports = connectDB;
