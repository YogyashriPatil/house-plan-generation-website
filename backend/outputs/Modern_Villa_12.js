function drawHousePlan(ctx) {
    const unit = 20; // 1 unit = 20 pixels (representing 1 foot)

    // Define dimensions for the house footprint (excluding parking for F1)
    const parkingWidthFt = 10;
    const houseWidthFt = 25;
    const floorHeightFt = 24; // Height of the main house block for each floor

    // Calculate pixel dimensions for each floor plan area
    const floorWidthPx = (parkingWidthFt + houseWidthFt) * unit; // Total width: 35ft * 20px/ft = 700px
    const floorHeightPx = floorHeightFt * unit; // Total height: 24ft * 20px/ft = 480px

    const padding = 50; // Padding around and between floor plans

    // Configure canvas drawing styles
    ctx.font = "14px Arial";
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;

    // --- Ground Floor Plan (Left Side of Canvas) ---
    const f1_x = padding;
    const f1_y = padding;

    // Label for Ground Floor
    ctx.fillText("Ground Floor Plan", f1_x + floorWidthPx / 2 - 60, f1_y - 20);

    // Parking/Carport: 10ft x 24ft
    const parking_w = parkingWidthFt * unit;
    const parking_h = floorHeightFt * unit;
    ctx.strokeRect(f1_x, f1_y, parking_w, parking_h);
    ctx.fillText("Parking", f1_x + 10, f1_y + 20);

    // Main House Block on Ground Floor: 25ft x 24ft (600 sq.ft)
    const house1_x = f1_x + parking_w;
    const house1_y = f1_y;
    const house1_w = houseWidthFt * unit;
    const house1_h = floorHeightFt * unit;

    // Living Room: 25ft x 14ft (Spacious as per preference)
    const living_h = 14 * unit;
    ctx.strokeRect(house1_x, house1_y, house1_w, living_h);
    ctx.fillText("Living Room", house1_x + 10, house1_y + 20);

    // Remaining lower section of the house block: 25ft x 10ft
    const lowerSection1_y = house1_y + living_h;
    const lowerSection1_h = 10 * unit;

    // Dining Room: 10ft x 10ft (Right side of the lower section)
    const dining_w = 10 * unit;
    ctx.strokeRect(house1_x + (houseWidthFt - 10) * unit, lowerSection1_y, dining_w, lowerSection1_h);
    ctx.fillText("Dining Room", house1_x + (houseWidthFt - 10) * unit + 10, lowerSection1_y + 20);

    // Kitchen: 15ft x 6ft (Left side of lower section, upper part)
    const kitchen_w = 15 * unit;
    const kitchen_h = 6 * unit;
    ctx.strokeRect(house1_x, lowerSection1_y, kitchen_w, kitchen_h);
    ctx.fillText("Kitchen", house1_x + 10, lowerSection1_y + 20);

    // Stairs Up: 10ft x 4ft (Left side of lower section, lower part, under kitchen)
    const stairs1_w = 10 * unit;
    const stairs1_h = 4 * unit;
    ctx.strokeRect(house1_x, lowerSection1_y + kitchen_h, stairs1_w, stairs1_h);
    ctx.fillText("Stairs Up", house1_x + 10, lowerSection1_y + kitchen_h + 20);

    // Powder Room (Half Bath): 5ft x 4ft (Next to stairs, under kitchen)
    const powder_w = 5 * unit;
    const powder_h = 4 * unit;
    ctx.strokeRect(house1_x + stairs1_w, lowerSection1_y + kitchen_h, powder_w, powder_h);
    ctx.fillText("Powder", house1_x + stairs1_w + 5, lowerSection1_y + kitchen_h + 15);


    // --- First Floor Plan (Right Side of Canvas) ---
    const f2_x = f1_x + floorWidthPx + padding;
    const f2_y = padding;

    // Label for First Floor
    ctx.fillText("First Floor Plan", f2_x + floorWidthPx / 2 - 60, f2_y - 20);

    // Main House Block on First Floor: 25ft x 24ft (600 sq.ft, mirrors ground floor house footprint)
    const house2_x = f2_x + parking_w; // Aligns with the ground floor house block
    const house2_y = f2_y;
    const house2_w = houseWidthFt * unit;
    const house2_h = floorHeightFt * unit;

    // Upper Section: Bedrooms (14ft high)
    const upperSection2_h = 14 * unit;

    // Master Bedroom: 15ft x 14ft (one of the 2 upstairs bedrooms)
    const master_br_w = 15 * unit;
    ctx.strokeRect(house2_x, house2_y, master_br_w, upperSection2_h);
    ctx.fillText("Master Bedroom", house2_x + 10, house2_y + 20);

    // Bedroom 2: 10ft x 14ft (the second upstairs bedroom)
    const br2_w = 10 * unit;
    ctx.strokeRect(house2_x + master_br_w, house2_y, br2_w, upperSection2_h);
    ctx.fillText("Bedroom 2", house2_x + master_br_w + 10, house2_y + 20);

    // Lower Section: Stairs/Hallway/Bathroom (10ft high)
    const lowerSection2_y = house2_y + upperSection2_h;
    const lowerSection2_h = 10 * unit;

    // Stairs Landing / Hallway: 15ft x 10ft (above ground floor stairs)
    const stairs2_w = 15 * unit;
    ctx.strokeRect(house2_x, lowerSection2_y, stairs2_w, lowerSection2_h);
    ctx.fillText("Hallway/Stairs", house2_x + 10, lowerSection2_y + 20);

    // Bathroom (Full Bath): 10ft x 10ft (next to hallway, below Bedroom 2)
    const bath_w = 10 * unit;
    ctx.strokeRect(house2_x + stairs2_w, lowerSection2_y, bath_w, lowerSection2_h);
    ctx.fillText("Bathroom", house2_x + stairs2_w + 10, lowerSection2_y + 20);

    // Balcony: 5ft x 10ft (Extending off the side of Bedroom 2)
    const balcony_w_ft = 5;
    const balcony_h_ft = 10;
    const balcony_x = house2_x + house2_w; // Extends right from the main house block
    const balcony_y = house2_y + (upperSection2_h / 2) - (balcony_h_ft * unit / 2); // Vertically centered with upper section
    const balcony_w = balcony_w_ft * unit;
    const balcony_h = balcony_h_ft * unit;
    ctx.strokeRect(balcony_x, balcony_y, balcony_w, balcony_h);
    ctx.fillText("Balcony", balcony_x + 5, balcony_y + 15);
}