import dotenv from "dotenv";
import app from "./app.js";
import sequelize from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
// app.use(express.json());
(async () => {
  try {
    await sequelize.sync(); // sync models to DB
    console.log("📦 Database synchronized");

    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
})();
