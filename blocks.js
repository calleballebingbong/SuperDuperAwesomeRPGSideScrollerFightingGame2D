const blocks = [
    { x: 200,   y: 400, w: 100, h: 20 },
    { x: 400,   y: 300, w: 150, h: 20 },
    { x: 700,   y: 500, w: 200, h: 20 },
];

function rectOverlap(a, b) {
    return (
    a.x < b.x + b.w &&
    a.x + a.width > b.x &&
    a.y < b.y + b.h &&
    a.y + a.height > b.y
    );
}