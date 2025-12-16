import dotenv from "dotenv";
import path from 'path'
dotenv.config({ path: path.join(process.cwd(), 'config.env') });

import mongoose from "mongoose";
import app from "./app";


const MONGO_URI: string = process.env.DATABASE_LOCAL as string;

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
