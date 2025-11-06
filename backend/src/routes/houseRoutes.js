import express from "express";
import { generateHousePlan, getAllPlans ,getHousePlanById, getUserPlans,} from "../controller/housecontroller.js";

const router = express.Router();

router.post("/generate", generateHousePlan);
router.get("/", getAllPlans);
router.get("/:id", getHousePlanById);

// Get all plans by user
router.get("/user/:user_id", getUserPlans);

export default router;
