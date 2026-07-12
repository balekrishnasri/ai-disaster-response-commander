import mongoose from "mongoose";

export const connectDatabase = async () => {
  const connection = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${connection.connection.host}`);
  return connection;
};
