import dotenv from "dotenv";
// import app from "./app.js";
import sequelize from "./config/db.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import houseRoutes from "./routes/houseRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:8080"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "token"]
}));
app.use("/users", userRoutes);
app.use("/api/houses", houseRoutes);

// (async () => {
//   try {
//     await sequelize.sync(); // sync models to DB
//     console.log("📦 Database synchronized");

//     app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
//   } catch (error) {
//     console.error("❌ Failed to start server:", error);
//   }
// })();
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
