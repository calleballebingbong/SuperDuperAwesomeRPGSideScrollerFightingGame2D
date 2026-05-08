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
    if (e.code === "ShiftLeft") {
        const now = Date.now();

        if (!dash && now - lastDashTime > dashCooldown){
            dash = true;
            console.log(dash)
            dashStartTime = now;
            lastDashTime = now;
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
    if (e.code === "KeyR") resetGame();


});

document.addEventListener("keydown", (e) => {
    if (gameOver && e.key.toLowerCase()=== 'r'){
        resetGame();
    }
});