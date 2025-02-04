import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO;

if (!MONGODB_URI) {
  throw new Error("❌ Please define the MONGO environment variable.");
}

const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("✅ Already connected to MongoDB");
      return mongoose;
    }

    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });

    console.log("✅ MongoDB Connected Successfully");
    return mongoose;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    return null;
  }
};

export default connectToDatabase;
