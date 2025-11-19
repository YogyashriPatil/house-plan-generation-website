import express from "express";
// import { signup } from "../controller/userController.js";
import { registerUser, loginUser , logout, getProfile } from "../controller/userController.js";
import { authUser, verifyToken } from "../middleware/authMiddleware.js";
import { generateHousePlan } from "../controller/housecontroller.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout); // optional; just returns message
router.get("/profile", verifyToken, getProfile);
router.put("/update-profile", authUser, updateProfile);
router.put("/change-password", authUser, changePassword);

// router.post("/generate", generateHousePlan)
export default router;