import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in the .env file.");
  process.exit(1);
}

export function connectDB() {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Successfully connected to MongoDB.");
    })
    .catch((err) => {
      console.error("Database connection failed.", err);
      process.exit(1);
    });
}
