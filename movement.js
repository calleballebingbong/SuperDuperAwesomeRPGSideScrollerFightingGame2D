let jumpCount = 0;
let maxJumps = 2;

addEventListener("keydown", function(e) {
    if (e.code === "KeyD") rightDown = true;
    if (e.code === "KeyA") leftDown = true;
    if (e.code === "KeyW" && jumpCount < maxJumps) {
    vy = -20;
    grounded = false;
    jumpCount ++;
    }
});

addEventListener("keyup", function(e) {
    if (e.code === "KeyD") rightDown = false;
    if (e.code === "KeyA") leftDown = false;
});
