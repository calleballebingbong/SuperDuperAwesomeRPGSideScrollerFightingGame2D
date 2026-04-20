addEventListener("keydown", function(e) {
    if (e.code === "KeyD") rightDown = true;
    if (e.code === "KeyA") leftDown = true;

    if (e.code === "KeyW") {
        if (jumpCount < maxJumps) {
            vy = -20;
            grounded = false;
            jumpCount++;
            jumpKeyRelease = false;
        } else if (onWall && jumpKeyRelease) {
            vy = -20;
            vx = wallDir * -20;
            grounded = false;
            jumpKeyRelease = false;
        }
    }
});

addEventListener("keyup", function(e) {
    if (e.code === "KeyD") rightDown = false;
    if (e.code === "KeyA") leftDown = false;
    if (e.code === "KeyW") jumpKeyRelease = true;
});
