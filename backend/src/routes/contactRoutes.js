import express from "express";
import { saveContactMessage } from "../controller/contactController.js";
import { authUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/contactus",  saveContactMessage);

export default router;
