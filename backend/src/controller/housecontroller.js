import House from "../models/house.js";
import { generatePlan } from "../services/plangenerator.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

import HousePlan from "../models/house.js";

export const generateHousePlan = async (req, res) => {
  try {
    const { user_id, total_area, floors, rooms_count, plan_name } = req.body;

    // Basic validation
    if (!user_id) return res.status(400).json({ error: "user_id is required" });
    if (total_area == null) return res.status(400).json({ error: "total_area is required" });
    if (rooms_count == null) return res.status(400).json({ error: "rooms_count is required" });
    if (floors == null) return res.status(400).json({ error: "floors is required" });

    const layoutJSON = generateLayoutExample(total_area, floors, rooms_count); // your generator

    const newPlan = await HousePlan.create({
      user_id,
      plan_name: plan_name || `Plan_${Date.now()}`,
      total_area,
      floors,
      rooms_count,
      layout_json: layoutJSON,
      layout_image_url: null,
    });

    return res.status(201).json({ success: true, plan: newPlan });
  } catch (error) {
    console.error("Error generating plan:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// export const generateHousePlan = async (req, res, next) => {
//   console.log(req.body)
//   try {
//     const { user_id , area, floors, rooms } = req.body;
//     const plan = await generatePlan(area, floors, rooms);
//     // Step 1: Generate layout JSON
//     const layoutData = await generatePlan(area, floors, rooms);

//     // Step 2: Generate image (placeholder or dynamically)
//     // e.g., your front-end can send an image file or base64

//     // Example if image file is uploaded:
//     const imagePath = req.file?.path; // if using multer
//     let uploadedImage = null;

//     if (imagePath) {
//       uploadedImage = await cloudinary.uploader.upload(imagePath, {
//         folder: "house_plans",
//       });
//       fs.unlinkSync(imagePath); // delete local file
//     }
//     const newPlan = await House.create({
//       user_id,
//       total_area: area,
//       floors,
//       rooms_count : rooms,
//       layout_json: layoutData,
//       layout_image_url : uploadedImage?.secure_url || null,
//     });
// 
//     res.status(201).json({ success: true, message: "House plan generated successfully",data: newPlan});
//   } catch (error) {
//     next(error);
//   }
// };

// 🧾 Get house plan details by ID
export const getHousePlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await HousePlan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }

    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.error("Error fetching plan:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getAllPlans = async (req, res, next) => {
  try {
    const houses = await House.findAll();
    res.status(200).json({ success: true, data: houses });
  } catch (error) {
    next(error);
  }
};

export const getUserPlans = async (req, res) => {
  try {
    const { user_id } = req.params;
    const plans = await HousePlan.findAll({ where: { user_id } });

    res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error) {
    console.error("Error fetching user plans:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
