import express from "express";
// import { signup } from "../controller/userController.js";
import { registerUser, loginUser , logout, getProfile } from "../controller/userController.js";
import { authUser, verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout); // optional; just returns message
router.get("/profile", verifyToken, getProfile);

export default router;