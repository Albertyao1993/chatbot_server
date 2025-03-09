import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://localhost:27017/chatbot");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    const db = mongoose.connection.db;
    try {
      await db.collection("users").insertOne({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password",
      });
      console.log("User created");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
