import { createCanvas } from "canvas";
import fs from "fs";
import path from "path";

/**
 * Generate a 2D floor plan image from JSON data
 * @param {Object} planData - The JSON object containing room layout info
 * @param {string} outputFile - The output path for the generated PNG file
 */
export const generateFloorPlanImage = (planData, outputFile) => {
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 800, 600);

  // Draw each room as a rectangle (simple proportional visualization)
  const baseX = 50, baseY = 50;
  let x = baseX, y = baseY;

  planData.rooms.forEach((room, index) => {
    const width = Math.sqrt(room.area) * 3;
    const height = Math.sqrt(room.area) * 3;

    // Random color for each room
    ctx.fillStyle = `hsl(${index * 60}, 60%, 70%)`;
    ctx.fillRect(x, y, width, height);

    // Room label
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.fillText(room.name, x + 5, y + 20);

    // Move to next position
    x += width + 20;
    if (x > 700) {
      x = baseX;
      y += 150;
    }
  });

  // Save image as PNG
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputFile, buffer);
  console.log(`✅ Floor plan image saved at ${outputFile}`);
};
