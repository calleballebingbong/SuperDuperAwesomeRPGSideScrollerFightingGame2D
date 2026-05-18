let interactPressed = false;

addEventListener("keydown", function(e) {
    const action = e.code;
    if (action === "KeyB"){showHitboxes = !showHitboxes;}
    if (action === "KeyN") {invincible = !invincible;}
    if (action === "KeyD") rightDown = true;
    if (action === "KeyA") leftDown = true;
    if (action === "KeyE") interactPressed = true;
    if (action === "KeyL") {
        const now = Date.now();
        if (now - lastAttackTime >= attackCooldown) {
            attacking = true;
            playerAttack();
        }
    }
    if (action === "ShiftLeft") {
        const now = Date.now();

        if (!dash && now - lastDashTime > dashCooldown){
            dash = true;
            console.log(dash)
            dashStartTime = now;
            lastDashTime = now;
        }
    }

    if (action === "KeyW" || action === "Space") {
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
    if (action === "KeyT") {playerDamage += 5;}
    if (action === "KeyY") {playerDamage -= 5;}
});

addEventListener("keyup", function(e) {
    if (e.code === "KeyD") rightDown = false;
    if (e.code === "KeyA") leftDown = false;
    if (e.code === "KeyE") interactPressed = false;
    if (e.code === "KeyW" || e.code === "Space") jumpKeyRelease = true;
    if (e.code === "KeyR") resetGame();


});

document.addEventListener("keydown", (e) => {
    if (gameOver && e.key.toLowerCase()=== 'r'){
        resetGame();
    }
});