import express from "express";
import itemRoutes from "./routes/itemRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import errorController from "./controllers/errorController";

const app = express();
app.use(express.json());
app.use("/items", itemRoutes);
app.use("/users", userRoutes); // Add this line to use user routes
app.use("/", authRoutes);

app.use(errorController);

export default app;
