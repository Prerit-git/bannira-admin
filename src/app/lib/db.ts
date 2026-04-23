import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI missing in .env.local");
}

const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Mongo Connected Successfully");
  } catch (error) {
    console.log("Mongo Connection Error:", error);
  }
};

export default connectToDatabase;