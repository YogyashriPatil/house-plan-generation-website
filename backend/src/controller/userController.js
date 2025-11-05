import userModel from "../models/user.js"; // ✅ make sure this path & filename match your model

// 🧩 Signup Controller
export const registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // (optional) Check if user already exists
    const existingUser = await userModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // (optional) Hash password using bcrypt before saving
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await userModel.create({
      email,
      password, // replace with hashedPassword if you enable bcrypt
      firstName,
      lastName,
    });

    res.status(201).json({
      success: true,
      message: "You are signed up successfully",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "Error in signup",
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // (optional) Compare password if you hash it later
    // const isMatch = await bcrypt.compare(password, user.password);

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Error during login" });
  }
};
