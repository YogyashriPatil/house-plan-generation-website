import House from "../models/house.js";
import HousePlan from "../models/house.js";
import genAI from "../config/gemini.js";
import sequelize from "../config/db.js";
import path , { dirname }from "path";
import { fileURLToPath } from "url";
import { createCanvas } from "canvas";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import DXFWriterPkg from "dxf-writer";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🧠 Generate 2D House Plan (Image + Cloudinary + DB)
// export const generateHousePlan = async (req, res) => {
//   try {
//     const { user_id, plan_name, total_area, floors, rooms_count, preferences } = req.body;

//     if (!plan_name || !total_area || !floors || !rooms_count) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields",
//       });
//     }

//     // 🧠 Step 1: Generate a 2D floor plan image prompt
//     const prompt = `
//       You are an expert architectural AI.
//       Generate a top-view 2D house floor plan as a PNG image.

//       Details:
//       - Plan name: ${plan_name}
//       - Total area: ${total_area} sq.ft
//       - Floors: ${floors}
//       - Rooms: ${rooms_count}
//       - User preferences: ${preferences || "Standard residential layout"}

//       Requirements:
//       - Use a simple black line drawing on a white background.
//       - Include all key rooms with clear text labels:
//         Living Room, Kitchen, Bedroom, Bathroom, Balcony, Parking.
//       - If user omits details like balcony, washroom, or parking, include standard ones logically.
//       - Layout should look professional and well proportioned (2D top-down view).
//       - Do NOT include 3D perspective or decorative elements.
//     `;

//     // 🎨 Step 2: Generate Image using Gemini
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
//     const result = await model.generateContent(prompt);

//     const response = await result.response;

//     // Gemini may return an image as inline_data
//     const part = response.candidates?.[0]?.content?.parts?.find(
//       (p) => p.inline_data?.mime_type?.startsWith("image/")
//     );

//     if (!part) {
//       throw new Error("Model did not return image data. Try a simpler prompt.");
//     }
//     // 📦 Gemini returns Base64-encoded image
//     const imageBase64 = imageResult.data[0].b64_json;
//     const buffer = Buffer.from(imageBase64, "base64");

//     // 💾 Save temporary file
//     const fileName = `${plan_name.replace(/\s+/g, "_")}_${Date.now()}.png`;
//     const tempPath = `./generated_plans/${fileName}`;
//     const outputDir = path.resolve("./generated_plans");
//     if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
//     fs.writeFileSync(tempPath, buffer);

//     // ☁️ Step 3: Upload image to Cloudinary
//     const uploadResult = await cloudinary.uploader.upload(tempPath, {
//       folder: "house_plans",
//       resource_type: "image",
//     });
//     const imageUrl = uploadResult.secure_url;

//     // 🧹 Delete local temp file
//     fs.unlinkSync(tempPath);

//     // 🗄️ Step 4: Store info in DB
//     await sequelize.query(
//       `INSERT INTO HousePlans (user_id, plan_name, total_area, floors, rooms_count, layout_image_url)
//        VALUES (?, ?, ?, ?, ?, ?)`,
//       {
//         replacements: [user_id, plan_name, total_area, floors, rooms_count, imageUrl],
//       }
//     );

//     // ✅ Step 5: Send Response
//     res.status(200).json({
//       success: true,
//       message: "2D house plan generated successfully",
//       imageUrl,
//     });
//   } catch (error) {
//     console.error("Error generating house plan:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error generating house plan",
//       error: error.message,
//     });
//   }
// };

// 🏠 Generate House Plan (JSON → DXF → Image → Upload)
export const generateHousePlan = async (req, res) => {
  try {
    const token = req.headers.token; // read from your custom header
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id; // make sure your JWT payload has `id`

    if (!user_id) return res.status(400).json({ message: "User not found in token" });
    const { plan_name, total_area, floors, rooms_count , preferences} = req.body;

     // 🧠 Step 1: Generate JSON plan using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
    const prompt = `
      You are an expert architectural design AI that creates valid 2D DXF files for residential houses.

      🎯 Objective:
      Generate a complete 2D house floor plan in DXF format based on the user’s given requirements.

      User Input:
      - Plan name: ${plan_name}
      - Total area (in sq.ft): ${total_area}
      - Floors: ${floors}
      - Number of rooms: ${rooms_count}
      - User preferences (if any): ${preferences}

      ---

      🏗️ Rules for House Plan Generation:

      1. **Plan Layout:**
        - Always include essential rooms:
          - Living Room / Hall
          - Kitchen
          - At least one Bedroom
          - One Washroom
          - If the user doesn’t mention certain rooms (like Balcony, Parking, Washroom, etc.), you must automatically include them in logical positions.

      2. **Room Placement Guidelines:**
        - Living Room: Place at the front near entrance.
        - Kitchen: Adjacent to Living Room, near the dining space.
        - Bedroom(s): Toward quieter sides, include attached washrooms where possible.
        - Balcony: Connected to one bedroom or living room.
        - Parking: Place near entrance (ground floor).
        - Staircase: Include if floors > 1.

      3. **DXF Geometry Instructions:**
        - Each room must be drawn as a rectangular closed polyline or set of lines.
        - Use real-world scale (1 unit = 1 meter).
        - Include text labels (room names) inside each room using "TEXT" entity.
        - Use "layers" names to organize parts:
          - WALLS
          - ROOMS
          - TEXT
          - DOORS (optional)
        - Ensure the DXF starts with "0\nSECTION\n2\nHEADER" and ends with "0\nEOF".

      4. **DXF Quality Rules:**
        - All coordinates must be valid numeric values.
        - The DXF must not contain placeholder text, explanations, or markdown formatting.
        - Output should open correctly in AutoCAD or any DXF viewer.

      ---

      🧾 Example Output (Shortened for reference):

      0
      SECTION
      2
      HEADER
      0
      ENDSEC
      0
      SECTION
      2
      ENTITIES
      0
      LINE
      8
      WALLS
      10
      0
      20
      0
      11
      10
      21
      0
      0
      LINE
      8
      WALLS
      10
      10
      20
      0
      11
      10
      21
      8
      0
      TEXT
      8
      TEXT
      10
      3
      20
      4
      40
      0.5
      1
      Living Room
      0
      TEXT
      8
      TEXT
      10
      7
      20
      4
      40
      0.5
      1
      Kitchen
      0
      ENDSEC
      0
      EOF

      ---

      ⚙️ Output Format:
      - Respond with **DXF code only**.
      - Do **not** include explanations, comments, or markdown fences.
      - Start with "0\nSECTION" and end with "0\nEOF".
    `;

    const result = await model.generateContent(prompt);
    let dxfText = result.response.text().trim();

    // 🧹 Clean any accidental markdown formatting
    dxfText = dxfText.replace(/```dxf|```/g, "").trim();

    // 🔎 Basic validation
    if (!dxfText.startsWith("0\nSECTION") || !dxfText.endsWith("0\nEOF")) {
      throw new Error("Model output is not valid DXF format");
    }

    // 💾 Step 2: Save DXF file
    const outputDir = path.join(__dirname, "../../generated_plans");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const dxfPath = path.join(outputDir, `${plan_name.replace(/\s+/g, "_")}.dxf`);
    fs.writeFileSync(dxfPath, dxfText);

    // 🖼️ Step 3 (Optional): Create a placeholder image preview
    const canvas = createCanvas(600, 400);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 600, 400);
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText(plan_name, 50, 50);
    ctx.fillText("Auto-generated DXF plan", 50, 90);


    const imagePath = path.join(outputDir, `${plan_name.replace(/\s+/g, "_")}.png`);
    const out = fs.createWriteStream(imagePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    await new Promise((resolve) => out.on("finish", resolve));

    // ☁️ Step 4: Upload image (optional)
    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      folder: "house_plans",
      resource_type: "image",
    });

    const imageUrl = uploadResult.secure_url;
     // 💾 Store all info in DB
    await sequelize.query(
      `INSERT INTO HousePlans (user_id, plan_name,total_area,floors, rooms_count, plan_data, layout_image_url)
       VALUES (?, ?, ?, ?, ?, ?,?)`,
      {
        replacements: [user_id, plan_name,total_area, floors, rooms_count, dxfPath,imageUrl],
      }
    );

    res.status(200).json({
      success: true,
      message: "House plan generated successfully",
      dxfPath,
      imageUrl,
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
