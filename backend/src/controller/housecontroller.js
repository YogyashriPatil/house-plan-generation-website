import House from "../models/house.js";
import { generatePlan } from "../services/plangenerator.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const generateHousePlan = async (req, res, next) => {
  try {
    const { user_id , area, floors, rooms } = req.body;
    const plan = await generatePlan(area, floors, rooms);
    // Step 1: Generate layout JSON
    const layoutData = await generatePlan(area, floors, rooms);

    // Step 2: Generate image (placeholder or dynamically)
    // e.g., your front-end can send an image file or base64

    // Example if image file is uploaded:
    const imagePath = req.file?.path; // if using multer
    let uploadedImage = null;

    if (imagePath) {
      uploadedImage = await cloudinary.uploader.upload(imagePath, {
        folder: "house_plans",
      });
      fs.unlinkSync(imagePath); // delete local file
    }
    const newPlan = await House.create({
      user_id,
      total_area: area,
      floors,
      rooms_count : rooms,
      layout_json: layoutData,
      layout_image_url : uploadedImage?.secure_url || null,
    });
s
    res.status(201).json({ success: true, message: "House plan generated successfully",data: newPlan});
  } catch (error) {
    next(error);
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
