function drawHousePlan(ctx) {
    // Define canvas dimensions and a scaling factor (pixels per foot)
    const CANVAS_WIDTH = 900;
    const CANVAS_HEIGHT = 800;
    const UNIT = 15; // 15 pixels per foot

    // Set drawing styles
    ctx.font = "14px Arial";
    ctx.fillStyle = "#333";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#444"; // Room boundary color

    // Helper function to draw a room
    // xFt, yFt, wFt, hFt are in feet, relative to the current floor's absolute origin (floorOriginX, floorOriginY)
    function drawRoom(name, xFt, yFt, wFt, hFt, floorOriginX, floorOriginY) {
        const xPx = floorOriginX + xFt * UNIT;
        const yPx = floorOriginY + yFt * UNIT;
        const wPx = wFt * UNIT;
        const hPx = hFt * UNIT;

        ctx.strokeRect(xPx, yPx, wPx, hPx);
        ctx.fillText(name, xPx + 10, yPx + 20);
    }

    // --- Floor 1 (Ground Floor) Layout ---
    const floor1OriginX = 50; // Absolute X start for Floor 1 drawings on canvas
    const floor1OriginY = 50; // Absolute Y start for Floor 1 drawings on canvas

    // Label for Floor 1
    ctx.fillText("Ground Floor Plan", floor1OriginX, floor1OriginY - 20);

    // Draw the main house footprint for Floor 1 (e.g., 40ft wide x 25ft deep)
    // Rooms will be placed inside or attached to this main structure.
    ctx.strokeRect(floor1OriginX, floor1OriginY, 40 * UNIT, 25 * UNIT);

    // Parking / Garage (attached to the left side of the main house body)
    // x-coordinate is negative relative to floor1OriginX to place it to the left
    drawRoom("Garage / Parking", -20, 5, 20, 15, floor1OriginX, floor1OriginY); // (20ft x 15ft)

    // Entry / Foyer
    drawRoom("Entry", 0, 5, 8, 10, floor1OriginX, floor1OriginY); // (8ft x 10ft)

    // Living Room (near entrance, central)
    drawRoom("Living Room", 8, 5, 20, 15, floor1OriginX, floor1OriginY); // (20ft x 15ft)

    // Dining Room (adjacent to Living Room)
    drawRoom("Dining Room", 28, 5, 12, 10, floor1OriginX, floor1OriginY); // (12ft x 10ft)

    // Kitchen (adjacent to Dining Room)
    drawRoom("Kitchen", 28, 15, 12, 10, floor1OriginX, floor1OriginY); // (12ft x 10ft)

    // Powder Room (Bathroom, near entry/living)
    drawRoom("Powder Room", 8, 20, 6, 8, floor1OriginX, floor1OriginY); // (6ft x 8ft)

    // Stairs (for access to the second floor)
    drawRoom("Stairs", 14, 20, 10, 8, floor1OriginX, floor1OriginY); // (10ft x 8ft)


    // --- Floor 2 (First Floor) Layout ---
    const floor2OriginX = 50; // Align X with Floor 1
    const floor2OriginY = CANVAS_HEIGHT / 2 + 50; // Position Floor 2 below Floor 1, with vertical padding

    // Label for Floor 2
    ctx.fillText("First Floor Plan", floor2OriginX, floor2OriginY - 20);

    // Draw the main house footprint for Floor 2, aligning with Floor 1
    ctx.strokeRect(floor2OriginX, floor2OriginY, 40 * UNIT, 25 * UNIT);

    // Stairs Landing / Hallway (aligns with downstairs stairs position)
    drawRoom("Hallway / Stairs", 14, 0, 10, 8, floor2OriginX, floor2OriginY); // (10ft x 8ft)

    // Master Bedroom (quiet side)
    drawRoom("Master Bedroom", 5, 8, 18, 15, floor2OriginX, floor2OriginY); // (18ft x 15ft)

    // Master Bathroom (adjacent to Master Bedroom)
    drawRoom("Master Bath", 5, 23, 10, 8, floor2OriginX, floor2OriginY); // (10ft x 8ft)

    // Bedroom 2 (the "1 room count" specified by user, located on quiet side)
    drawRoom("Bedroom 2", 24, 8, 16, 14, floor2OriginX, floor2OriginY); // (16ft x 14ft)

    // Common Bathroom (near Bedroom 2)
    drawRoom("Common Bath", 24, 22, 10, 8, floor2OriginX, floor2OriginY); // (10ft x 8ft)

    // Balcony (typically extends outwards from the main house body)
    // y-coordinate is negative relative to floor2OriginY to place it above
    drawRoom("Balcony", 30, -10, 10, 10, floor2OriginX, floor2OriginY); // (10ft x 10ft)
}