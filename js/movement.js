addEventListener("keydown", function(e) {
    if (e.code === "KeyD") rightDown = true;
    if (e.code === "KeyA") leftDown = true;
    if (e.code === "KeyL") {
        const now = Date.now();
        if (now - lastAttackTime >= attackCooldown) {
            attacking = true;
            playerAttack();
        }
    }

    if (e.code === "KeyW" || e.code === "Space") {
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
    if (e.code === "KeyW" || e.code === "Space") jumpKeyRelease = true;
});

document.addEventListener("keydown", (e) => {
    if (gameOver && e.key.toLowerCase()=== 'r'){
        resetGame();
    }
});