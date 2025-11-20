function drawHousePlan(ctx) {
    const pixelsPerFoot = 15; // 1 foot = 15 pixels for canvas drawing
    const totalAreaSqFt = 1000;
    const numFloors = 1; // User specified 1 floor
    const numBedrooms = 2; // User specified 2 rooms, assumed as bedrooms

    // Standard rooms to include: Living Room, Kitchen, Bathroom, Balcony/Parking
    // We will include: Living Room, Kitchen, 2 Bedrooms, 1 Bathroom, 1 Balcony.

    // Calculate approximate house footprint (e.g., 33ft x 30ft for ~990 sq.ft)
    const houseWidthFt = 33;
    const houseHeightFt = 30; // totalAreaSqFt / houseWidthFt (approx)

    const houseWidthPx = houseWidthFt * pixelsPerFoot; // 495 px
    const houseHeightPx = houseHeightFt * pixelsPerFoot; // 450 px

    // Assume standard canvas size for centering.
    // In a real application, ctx.canvas.width and ctx.canvas.height would be reliable.
    const canvasWidth = ctx.canvas.width || 800;
    const canvasHeight = ctx.canvas.height || 600;

    // Calculate offset to center the house plan on the canvas
    const offsetX = (canvasWidth - houseWidthPx) / 2;
    const offsetY = (canvasHeight - houseHeightPx) / 2;

    // Set drawing styles
    ctx.font = "14px Arial";
    ctx.textAlign = "center"; // Center text in rooms
    ctx.fillStyle = "#333"; // Text color
    ctx.strokeStyle = "#000"; // Room boundary color
    ctx.lineWidth = 2;

    // Array to hold room data { name, x, y, w, h } in pixels (relative to house drawing origin)
    const rooms = [];

    // --- Ground Floor Layout (1 floor only) ---
    // Layout Strategy:
    // Left Column: Kitchen (top-left), Living Room (bottom-left)
    // Right Column: Bedroom 2 (top-right), Bathroom (middle-right), Bedroom 1 (bottom-right)
    // A central vertical passage separates the columns (not explicitly drawn as a room).
    // Balcony attached to the front (bottom) of the Living Room.

    // Define room dimensions in feet
    const living_dims = { w: 16, h: 12 }; // ~192 sqft
    const kitchen_dims = { w: 10, h: 12 }; // ~120 sqft
    const bed1_dims = { w: 12, h: 12 }; // ~144 sqft
    const bed2_dims = { w: 12, h: 12 }; // ~144 sqft
    const bath_dims = { w: 8, h: 6 }; // ~48 sqft
    const balcony_dims = { w: 10, h: 5 }; // ~50 sqft

    // Calculate pixel positions for each room, relative to (0,0) of the house drawing space
    // Y-coordinates are calculated from the top of the house drawing space, increasing downwards.

    // 1. Living Room (bottom-left)
    rooms.push({
        name: "Living Room",
        x: 0,
        y: (houseHeightFt - living_dims.h) * pixelsPerFoot, // Place at the bottom
        w: living_dims.w * pixelsPerFoot,
        h: living_dims.h * pixelsPerFoot
    });

    // 2. Kitchen (top-left, above Living Room)
    rooms.push({
        name: "Kitchen",
        x: 0,
        y: (houseHeightFt - living_dims.h - kitchen_dims.h) * pixelsPerFoot, // Above Living
        w: kitchen_dims.w * pixelsPerFoot,
        h: kitchen_dims.h * pixelsPerFoot
    });

    // 3. Balcony (attached to the bottom of Living Room, extending outwards)
    // This will extend beyond the main houseHeightPx, creating an L-shape if viewed from side.
    rooms.push({
        name: "Balcony",
        x: 0,
        y: houseHeightFt * pixelsPerFoot, // Directly below the main house block
        w: balcony_dims.w * pixelsPerFoot,
        h: balcony_dims.h * pixelsPerFoot
    });

    // Calculate the X-coordinate for the right column of rooms, leaving space for a central passage
    const passageWidthFt = 5; // Width of the central hallway/passage
    const rightColumnX_ft = Math.max(living_dims.w, kitchen_dims.w) + passageWidthFt;

    // 4. Bedroom 1 (bottom-right)
    rooms.push({
        name: "Bedroom 1",
        x: rightColumnX_ft * pixelsPerFoot,
        y: (houseHeightFt - bed1_dims.h) * pixelsPerFoot, // Place at the bottom
        w: bed1_dims.w * pixelsPerFoot,
        h: bed1_dims.h * pixelsPerFoot
    });

    // 5. Bathroom (middle-right, above Bedroom 1)
    rooms.push({
        name: "Bathroom",
        x: rightColumnX_ft * pixelsPerFoot,
        y: (houseHeightFt - bed1_dims.h - bath_dims.h) * pixelsPerFoot, // Above Bedroom 1
        w: bath_dims.w * pixelsPerFoot,
        h: bath_dims.h * pixelsPerFoot
    });

    // 6. Bedroom 2 (top-right, above Bathroom)
    rooms.push({
        name: "Bedroom 2",
        x: rightColumnX_ft * pixelsPerFoot,
        y: (houseHeightFt - bed1_dims.h - bath_dims.h - bed2_dims.h) * pixelsPerFoot, // Above Bathroom
        w: bed2_dims.w * pixelsPerFoot,
        h: bed2_dims.h * pixelsPerFoot
    });

    // --- Drawing all rooms ---
    ctx.save();
    // Translate context to center the house plan on the canvas
    ctx.translate(offsetX, offsetY);

    rooms.forEach(room => {
        // Draw room boundary
        ctx.strokeRect(room.x, room.y, room.w, room.h);

        // Label the room, adjusting text position for centering
        ctx.fillText(room.name, room.x + room.w / 2, room.y + room.h / 2 + 5);
    });

    ctx.restore();
}