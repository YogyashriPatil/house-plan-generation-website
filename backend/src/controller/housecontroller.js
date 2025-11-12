import House from "../models/house.js";
import HousePlan from "../models/house.js";
import genAI from "../config/gemini.js";
import sequelize from "../config/db.js";
import path , { dirname }from "path";
import { fileURLToPath } from "url";
import { createCanvas } from "canvas";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import jwt from "jsonwebtoken"


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// helper function to retry Gemini API calls
async function generateWithRetry(model, prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result;
    } catch (err) {
      // retry only if overloaded or service unavailable
      if (err.message.includes("503") || err.message.includes("overloaded")) {
        console.warn(`⚠️ Gemini overloaded. Retrying (${i + 1}/${retries})...`);
        await new Promise((r) => setTimeout(r, 2000 * (i + 1))); // exponential backoff
      } else {
        throw err; // if it's another type of error, stop retrying
      }
    }
  }
  throw new Error("Gemini service unavailable after multiple retries");
}

export const generateHousePlan = async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;
    if (!user_id) return res.status(400).json({ message: "User not found in token" });

    const { plan_name, total_area, floors, rooms_count, preferences } = req.body;

    // 🧠 Step 0: Check if a similar plan already exists for this user
    const [existing] = await sequelize.query(
      `SELECT * FROM HousePlans 
      WHERE total_area = ? 
        AND floors = ? 
        AND rooms_count = ?
      LIMIT 1`,
      { replacements: [total_area, floors, rooms_count] }
    );

    if (existing.length > 0) {
      return res.json({
        success: true,
        message: "Similar house plan found — showing existing result",
        imageUrl: existing[0].layout_image_url,
        codePreview: existing[0].plan_data?.slice(0, 300) + "...",
      });
    }

    // 🧠 Step 1: Prompt for AI to generate a JavaScript function
    const prompt = `
You are an expert architectural design AI that creates valid JavaScript functions 
to draw realistic 2D residential house floor plans on HTML canvas.

Generate a function named drawHousePlan(ctx) that:
- Uses ctx.strokeRect(x, y, w, h) to draw room boundaries.
- Uses ctx.fillText("RoomName", x+10, y+20) to label rooms.
- The layout should be logical:
   * Living Room near entrance
   * Kitchen adjacent to Living Room
   * Bedrooms in quiet side
   * Bathroom near bedrooms
   * Balcony or Parking added logically
- Scale drawing dimensions according to total area and room count.
- If floors > 1, divide canvas into 2 floor layouts.
- Include standard rooms even if user didn’t specify (like washroom, balcony, parking).
- Do not include markdown, explanations, or non-JavaScript content.
- Output valid JS only.

User input:
  - Total area: ${total_area} sq.ft
  - Floors: ${floors}
  - Rooms count: ${rooms_count}
  - ${preferences ? "Preferences: " + preferences : "Standard layout"}
`;

    // 🧠 Step 2: Generate the drawing function using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    // const result = await model.generateContent(prompt);
  //  const result = await model.generateContent(prompt);
// with this 👇
    const result = await generateWithRetry(model, prompt);
    let jsFunctionCode = result.response.text().trim();
    jsFunctionCode = jsFunctionCode.replace(/```(js|javascript)?/g, "").trim();


    // 🧾 Save the JS function to file
    const outputDir = path.join(process.cwd(), "outputs");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    const jsFilePath = path.join(outputDir, `${plan_name.replace(/\s+/g, "_")}.js`);
    fs.writeFileSync(jsFilePath, jsFunctionCode, "utf8");

    // 🖼️ Step 3: Create a canvas and run the generated code
    const canvas = createCanvas(1000, 800);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 1000, 800);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";

    try {
      // Safely execute the AI-generated function
      const drawFunc = new Function("ctx", jsFunctionCode + "\n return drawHousePlan(ctx);");
      drawFunc(ctx);
    } catch (err) {
      console.error("Error executing AI-generated function:", err);
      throw new Error("Generated function execution failed");
    }

    // 🖼️ Step 4: Save generated canvas as PNG
    // const imagePath = path.join(outputDir, `${plan_name.replace(/\s+/g, "_")}.png`);

    const buffer = canvas.toBuffer("image/png");
    const imagePath = `data:image/png;base64,${buffer.toString("base64")}`;

    // fs.writeFileSync(imagePath, buffer);

    // const out = fs.createWriteStream(imagePath);
    // const stream = canvas.createPNGStream();
    // stream.pipe(out);
    // await new Promise((resolve) => out.on("finish", resolve));

    // ☁️ Step 5: Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      folder: "house_plans",
      resource_type: "image",
    });
    console.log(uploadResult)
    const imageUrl = uploadResult.secure_url;
    console.log(imageUrl)
    // 💾 Step 6: Save to database
    await sequelize.query(
      `INSERT INTO HousePlans (user_id, plan_name, total_area, floors, rooms_count, plan_data, layout_image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          user_id,
          plan_name,
          total_area,
          floors,
          rooms_count,
          jsFilePath,
          imageUrl,
        ],
      }
    );

    // ✅ Step 7: Respond
    res.status(200).json({
      success: true,
      message: "House plan generated successfully",
      jsFilePath,
      imageUrl,
      generatedCodePreview: jsFunctionCode.slice(0, 300) + "...", // show short preview
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


// 🏠 Generate House Plan (JSON → DXF → Image → Upload)
// export const generateHousePlan = async (req, res) => {
//   try {
//     const token = req.headers.token; // read from your custom header
//     if (!token) return res.status(401).json({ message: "No token provided" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user_id = decoded.id; // make sure your JWT payload has `id`

//     if (!user_id) return res.status(400).json({ message: "User not found in token" });
//     const { plan_name, total_area, floors, rooms_count , preferences} = req.body;

//      // 🧠 Step 1: Generate JSON plan using Gemini
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
//     const prompt2 = `You are an expert architectural design AI that creates valid
//       function for make drawing in the canvas that show the house design in 2D 
//       for for residential houses. Generate a complete 2D house floor plan in 
//       canvas format based on the user’s given requirements.

//       ***** Output must be a valid JavaScript function:
//           - Named drawHousePlan(ctx)
//           - Uses ctx.strokeRect(x, y, w, h) to draw rooms.
//           - Uses ctx.fillText("RoomName", x+10, y+20) to label rooms.
//           - Coordinates and dimensions should scale with total_area and room count.
//           - Do not add explanations or text outside the code.
      
//       🏗️ Rules for House Plan Generation:
//         1. Plan Layout:
//           - Always include essential rooms:
//               - Living Room / Hall
//               - Kitchen
//               - At least one Bedroom
//               - One Washroom
//               - If the user doesn’t mention certain rooms (like Balcony, 
//                 Parking, Washroom, etc.), you must automatically include 
//                 them in logical positions.
//         2. Room Placement Guidelines:
//             - Living Room: Place at the front near entrance.
//             - Kitchen: Adjacent to Living Room, near the dining space.
//             - Bedroom(s): Toward quieter sides, include attached 
//                 washrooms where possible.
//             - Balcony: Connected to one bedroom or living room.
//             - Parking: Place near entrance (ground floor).
//             - Staircase: Include if floors > 1.

//       Generate a structured canava data for a house plan with these details:
//         - Total area: ${total_area} sq.ft
//         - Floors: ${floors}
//         - Rooms count: ${rooms_count}
//         - ${preferences ? "User preferences: " + preferences : "" || "Standard residential layout"}

//       ***** if floors > 1 partition of the canvas in the 2 parts. And one for 1 Floor.
//             The 1st floor follow the rule like parking must added in the 1st floor,
//             but not added int the floors > 1.
//           if user give the
//             1. 1BKH - only one bedroom, one kitchen and 1 hall
//             2. 2BKH - only two bedroom, one kitchen and 1 hall
//             3. 3BKH - only three bedroom, one kitchen and 1 hall

//       Requirements:
//           - Use a simple black line drawing on a white background.
//           - Include all key rooms with clear text labels:
//             Living Room, Kitchen, Bedroom, Bathroom, Balcony, Parking.
//           - If user omits details like balcony, washroom, or parking, include standard ones logically.
//           - Layout should look professional and well proportioned (2D top-down view).
//           - Do NOT include 3D perspective or decorative elements.

//       📐 Canvas Geometry Rules:
//         - Draw each room as rectangular closed polylines.
//         - Use real scale (1 unit = 1 meter).
//         - Include text labels (room names) inside rooms.
//         - Use layers: WALLS, ROOMS, TEXT, DOORS.

//     `
//     const result = await model.generateContent(prompt2);
//     let dxfText = result.response.text().trim();

        
//     // const canvas = createCanvas(1000, 1000);
//     // const ctx = canvas.getContext("2d");

//     // ctx.fillStyle = "white";
//     // ctx.fillRect(0, 0, 1000, 1000);

//     // // Draw rooms based on text
//     // function drawRoom(x, y, w, h, name) {
//     //   ctx.strokeRect(x, y, w, h);
//     //   ctx.font = "20px Arial";
//     //   ctx.fillText(name, x + 10, y + 30);
//     //   ctx.arc(x,y)
//     // }

//     // drawRoom(50, 50, 400, 300, "Bedroom");
//     // drawRoom(50, 400, 400, 300, "Hall");
//     // drawRoom(500, 50, 400, 300, "Kitchen");

//     // const buffer = canvas.toBuffer("image/png");
//     // fs.writeFileSync("plan.png", buffer);

//     // 🧹 Clean any accidental markdown formatting
//     dxfText = dxfText.replace(/```dxf|```/g, "").trim();

//     // 🔎 Basic validation
//     // 🖼️ Step 3 (Optional): Create a placeholder image preview
//     const canvas = createCanvas(600, 400);
//     const ctx = canvas.getContext("2d");
//     ctx.fillStyle = "#fff";
//     ctx.fillRect(0, 0, 600, 400);
//     ctx.fillStyle = "#000";
//     ctx.font = "20px Arial";
//     ctx.fillText(plan_name, 50, 50);
//     ctx.fillText("Auto-generated DXF plan", 50, 90);


//     const imagePath = path.join(outputDir, `${plan_name.replace(/\s+/g, "_")}.png`);
//     const out = fs.createWriteStream(imagePath);
//     const stream = canvas.createPNGStream();
//     stream.pipe(out);
//     await new Promise((resolve) => out.on("finish", resolve));

//     // ☁️ Step 4: Upload image (optional)
//     const uploadResult = await cloudinary.uploader.upload(imagePath, {
//       folder: "house_plans",
//       resource_type: "image",
//     });

//     const imageUrl = uploadResult.secure_url;
//      // 💾 Store all info in DB
//     await sequelize.query(
//       `INSERT INTO HousePlans (user_id, plan_name,total_area,floors, rooms_count, plan_data, layout_image_url)
//        VALUES (?, ?, ?, ?, ?, ?,?)`,
//       {
//         replacements: [user_id, plan_name,total_area, floors, rooms_count, dxfPath,imageUrl],
//       }
//     );

//     res.status(200).json({
//       success: true,
//       message: "House plan generated successfully",
//       dxfPath,
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
