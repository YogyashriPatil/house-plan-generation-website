import sequelize from "../config/db.js";
import jwt from "jsonwebtoken"
export const saveContactMessage = async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const { name, email , message } = req.body;

    if (!email || ! name || !message) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required",
      });
    }

    await sequelize.query(
      `INSERT INTO ContactMessages (user_id, name, email , message)
       VALUES (?, ?, ?, ?)`,
      { replacements: [user_id, name, email, message] }
    );

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });

  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
