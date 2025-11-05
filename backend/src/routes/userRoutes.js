import express from "express";
// import { signup } from "../controller/userController.js";
import { registerUser, loginUser } from "../controller/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router; // 👈 important!
// 