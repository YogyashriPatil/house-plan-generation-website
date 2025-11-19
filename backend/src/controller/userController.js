import userModel from "../models/user.js"; // ✅ make sure this path & filename match your model
import bcrypt from "bcrypt";
import sequelize from "../config/db.js";
import jwt from "jsonwebtoken";
// 🧩 Signup Controller

const JWT_SECRET=process.env.JWT_SECRET;

export const registerUser = async (req, res) => {
  console.log("🔥 Signup route hit with body:", req.body);
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log(req.body);
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // (optional) Check if user already exists
    const [existingUser] = await sequelize.query(
      "SELECT id FROM Users WHERE email = ?",
      { replacements: [email] }
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    // (optional) Hash password using bcrypt before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await sequelize.query(
      `INSERT INTO Users (firstName, lastName, email, password, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      {
        replacements: [firstName, lastName, email, hashedPassword],
      }
    );

    console.log("✅ User created:", user.id);
    res.status(201).json({
      success: true,
      message: "You are signed up successfully",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "Error in signup",
      error,
    });
  }
};
export const loginUser = async (req, res) => {
  console.log("🔥 Login route hit with body:", req.body);

  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) 
    {
      return res.status(401).json(
        { 
          message: "Invalid credentials" 
        });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Error during login" });
  }
};

export const logout = async (req, res) => {
  try {
    // In JWT-based systems, logout is handled client-side by deleting the token.
    // You can optionally blacklist tokens in DB if you need strict control.
    res.status(200).json({
      success: true,
      message: "Logout successful. Please clear token on client side.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ Raw SQL query to fetch user
    const [results] = await sequelize.query(
      "SELECT id, firstName, lastName, email, createdAt FROM Users WHERE id = ?",
      {
        replacements: [userId],
      }
    );

    if (!results || results.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

     const user = results[0];

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user,
    });

  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// update profile
export const updateProfile = async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    await User.update(
      { name, email, phone },
      { where: { id: req.authUser.id } }
    );

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
};

export const changePassword = async (req, res) => {
  const { oldPass, newPass } = req.body;

  try {
    const user = await User.findByPk(req.authUser.id);

    const match = await bcrypt.compare(oldPass, user.password);
    if (!match)
      return res.status(400).json({ message: "Old password is incorrect" });

    const hashed = await bcrypt.hash(newPass, 10);

    await User.update({ password: hashed }, { where: { id: user.id } });

    res.json({ success: true, message: "Password updated" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};