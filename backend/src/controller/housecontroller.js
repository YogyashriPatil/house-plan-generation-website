import House from "../models/House.js";
import { generatePlan } from "../services/plangenerator.js";

export const generateHousePlan = async (req, res, next) => {
  try {
    const { area, floors, rooms } = req.body;
    const plan = await generatePlan(area, floors, rooms);

    const newHouse = await House.create({
      area,
      floors,
      rooms,
      planDetails: plan,
    });

    res.status(201).json({ success: true, data: newHouse });
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
