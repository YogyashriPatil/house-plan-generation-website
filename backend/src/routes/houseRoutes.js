import express from "express";
import { generateHousePlan, getAllPlans } from "../controller/housecontroller.js";

const router = express.Router();

router.post("/generate", generateHousePlan);
router.get("/", getAllPlans);

export default router;
