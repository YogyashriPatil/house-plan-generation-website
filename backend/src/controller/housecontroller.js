import House from "../models/house.js";
import HousePlan from "../models/house.js";
import genAI from "../config/gemini.js";
import sequelize from "../config/db.js";

export const generateHousePlan = async (req, res) => {
  try {
    const { user_id,plan_name, total_area, floors, rooms_count , preferences} = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an AI architect. Generate a JSON file for a house plan.

      Constraints:
      - Total area: ${total_area} sq. ft
      - Floors: ${floors}
      - Rooms: ${rooms_count}
      - Plan name: "${plan_name}"
      - preferences: "${preferences}"
      Return ONLY valid JSON, with no explanations or text.
      The JSON should follow this structure:
      {
        "plan_name": "string",
        "total_area": "number",
        "floors": "number",
        "rooms": [
          { "name": "string", "area": "number", "floor": "number" }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    // 🧠 Safe JSON extraction
    let jsonText = text.trim();
    jsonText = jsonText.replace(/```json|```/g, "").trim();

    const match = jsonText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No valid JSON found in model response");

    const jsonData = JSON.parse(match[0]);

    await sequelize.query(
      `INSERT INTO HousePlans (user_id, plan_name, plan_data)
       VALUES (?, ?, ?)`,
      {
        replacements: [user_id, plan_name, JSON.stringify(jsonData)],
      }
    );

    res.status(200).json({
      success: true,
      message: "House plan generated successfully",
      plan: jsonData,
    });
  } catch (error) {
    console.error("Error generating house plan:", error);
    res.status(500).json({
      success: false,
      message: "Error generating house plan",
      error: error.message,
    });
  }
};

// export const generateHousePlan = async (req, res) => {
//   try {
//     const { user_id, total_area, floors, rooms_count, plan_name, preferences } = req.body;
//     //  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
//     if (!total_area || !floors || !rooms_count) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields"
//       });
//     }

//     // 🧠 Step 1: Generate layout JSON using Gemini
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

//     // const prompt = `
//     //   You are an expert architectural planner AI.
//     //   Generate a structured JSON for a house plan with these details:
//     //   - Total area: ${total_area} sq.ft
//     //   - Floors: ${floors}
//     //   - Rooms count: ${rooms_count}
//     //   - ${preferences ? "User preferences: " + preferences : ""}

//     //   The JSON should have this structure:
//     //   {
//     //     "total_area": 1200,
//     //     "floors": 2,
//     //     "rooms": [
//     //       {"name": "Living Room", "x": 0, "y": 0, "width": 5, "height": 4},
//     //       {"name": "Kitchen", "x": 5, "y": 0, "width": 3, "height": 3}
//     //     ]
//     //   }
//     // `;

//     const prompt = `
//         You are an AI architect. Generate a JSON file for a house plan.

//         Constraints:
//         - Total area: ${total_area} sq. ft
//         - Floors: ${floors}
//         - Rooms: ${rooms_count}
//         - Plan name: "${plan_name}"

//         Return ONLY valid JSON, with no extra text or explanation.
//         The JSON should follow this schema:
//         {
//           "plan_name": "string",
//           "total_area": "number",
//           "floors": "number",
//           "rooms": [
//             {
//               "name": "string",
//               "area": "number",
//               "floor": "number"
//             }
//           ]
//         }
//         `;

//     const result = await model.generateContent(prompt);
//     const text = result.response.text();

//     // Parse JSON safely
//     const layout_json = JSON.parse(text);

//     // 🏗️ Step 2: Generate CAD-style image from description
//     const imageModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const imagePrompt = `
//       Create a simple top-view CAD-style image of a ${floors}-floor house 
//       with ${rooms_count} rooms and total area ${total_area} sq.ft.
//       Show clear room boundaries and labels.
//     `;

//     const imageResponse = await imageModel.generateImage({
//       prompt: imagePrompt,
//       size: "1024x1024"
//     });

//     // Gemini returns base64 image data
//     const layout_image_base64 = imageResponse.response.imageData;
//     const layout_image_url = `data:image/png;base64,${layout_image_base64}`;

//     // 💾 Step 3: Save to MySQL
//     await sequelize.query(
//       `INSERT INTO HousePlans 
//         (user_id, plan_name, total_area, floors, rooms_count, layout_json, layout_image_url, created_at)
//        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
//       {
//         replacements: [
//           user_id,
//           plan_name || "My House Plan",
//           total_area,
//           floors,
//           rooms_count,
//           JSON.stringify(layout_json),
//           layout_image_url
//         ],
//       }
//     );

//     // ✅ Step 4: Send Response
//     res.status(201).json({
//       success: true,
//       message: "House plan generated successfully",
//       data: {
//         layout_json,
//         layout_image_url
//       }
//     });

//   } catch (error) {
//     console.error("Error generating house plan:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error generating house plan",
//       error: error.message
//     });
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
