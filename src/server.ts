import mongoose from "mongoose";
import app from "./app";

const MONGO_URI = "mongodb://localhost:27017/testdb";

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (err) {
    console.error(err);
  }
}

start();
