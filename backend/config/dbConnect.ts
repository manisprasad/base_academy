import mongoose, { Mongoose } from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "Not found";

export const connectDB = async (): Promise<void> => {
  try {
    if (MONGO_URI === "Not found") {
      throw new Error("❌ MongoDB URI is required in environment variables.");
    }

    const connection: Mongoose = await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB connected successfully."); // ✅ This will now always show

    const states: Record<number, string> = {
      0: "Disconnected",
      1: "Connected",
      2: "Connecting",
      3: "Disconnecting"
    };

    console.log(`📡 Mongoose connection state: ${states[connection.connection.readyState]}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit the process if connection fails
  }
};
