function drawHousePlan(ctx) {
    const scale = 12; // Pixels per foot. Adjust for desired overall drawing size.
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    const roomPadding = 10;
    const labelOffset = 20;

    // Define rooms with their dimensions in feet and relative positions
    // The (x, y) coordinates represent the top-left corner of the room
    // The layout aims for logical flow: public spaces (Living, Kitchen) near one side,
    // private spaces (Bedrooms, Bathroom) grouped, and external areas (Balcony, Parking) attached.
    const rooms_ft = [
        // Main house structure (right of Parking, starting at x=15)
        // Public Area (bottom half of house structure, starting at y=15)
        { name: "Living Room", x: 15, y: 15, w: 18, h: 15 }, // 18x15 = 270 sq.ft
        { name: "Kitchen", x: 15 + 18, y: 15, w: 12, h: 12 }, // 12x12 = 144 sq.ft (adjacent to Living)

        // Private Area (top half of house structure, starting at y=0)
        { name: "Master Bedroom", x: 15, y: 0, w: 15, h: 13 }, // 15x13 = 195 sq.ft
        { name: "Bedroom 2", x: 15 + 15, y: 0, w: 12, h: 12 }, // 12x12 = 144 sq.ft (adjacent to Master)
        { name: "Bathroom", x: 15 + 15 + 12, y: 0, w: 8, h: 8 }, // 8x8 = 64 sq.ft (adjacent to Bedroom 2)

        // External Areas
        { name: "Balcony", x: 15 + 18 + 12, y: 15, w: 10, h: 8 }, // 10x8 = 80 sq.ft (adjacent to Kitchen/Living)
        { name: "Parking", x: 0, y: 10, w: 15, h: 20 } // 15x20 = 300 sq.ft (to the left of the main house block)
    ];

    // Calculate the overall bounding box of the entire plan in feet
    let minX_ft = Infinity, minY_ft = Infinity, maxX_ft = -Infinity, maxY_ft = -Infinity;
    rooms_ft.forEach(room => {
        minX_ft = Math.min(minX_ft, room.x);
        minY_ft = Math.min(minY_ft, room.y);
        maxX_ft = Math.max(maxX_ft, room.x + room.w);
        maxY_ft = Math.max(maxY_ft, room.y + room.h);
    });

    const planWidth_ft = maxX_ft - minX_ft;
    const planHeight_ft = maxY_ft - minY_ft;

    const planWidth_px = planWidth_ft * scale;
    const planHeight_px = planHeight_ft * scale;

    // Calculate global offset to center the entire plan (including parking) on the canvas
    const globalOffsetX = (canvasWidth - planWidth_px) / 2 - (minX_ft * scale);
    const globalOffsetY = (canvasHeight - planHeight_px) / 2 - (minY_ft * scale);

    // Set drawing styles
    ctx.font = `${scale}px Arial`; // Scale font size based on overall scale
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    // Draw each room
    rooms_ft.forEach(room => {
        const x_px = globalOffsetX + room.x * scale;
        const y_px = globalOffsetY + room.y * scale;
        const w_px = room.w * scale;
        const h_px = room.h * scale;

        // Draw room boundary
        ctx.strokeRect(x_px, y_px, w_px, h_px);

        // Label the room
        ctx.fillText(room.name, x_px + roomPadding, y_px + labelOffset);
    });
}