import express from "express";
import cors from "cors";
import morgan from "morgan";

import houseRoutes from "./routes/houseRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Register all routes here 👇
app.use("/api/houses", houseRoutes);
app.use("/api/users", userRoutes);

// Root route (optional)
app.get("/", (req, res) => {
  res.send("🏠 House Plan API is running...");
});

export default app;
