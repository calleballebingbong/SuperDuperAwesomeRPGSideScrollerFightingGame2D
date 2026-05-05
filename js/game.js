// Global game variables
let scrollX = 0;
let xScreen = 0;
let gameOver = false;

// Input variables
let leftDown = false;
let rightDown = false;

// Canvas setup
const canvas = document.getElementById("canvas");
canvas.width = 1200;
canvas.height = 550;
const ctx = canvas.getContext("2d");

if (!canvas) {
  console.error("Canvas element not found! Check HTML: <canvas id='canvas'>");
}

if (!ctx) {
  console.error("ctx is null — canvas.getContext failed?");
}

// Focus the canvas for keyboard input
canvas.focus();

function resetGame() {
  x = 0;
  y = 0;
  scrollX = 0;
  xScreen = 0;
  vx = 0;
  vy = 0;
  grounded = false;
  jumpCount = 0;
  onWall = false;
  wallDir = 0;

  health = maxHealth;
  invincible = false;
  lastDamageTime = 0;
  isAttacking = false;
  lastAttackTime = 0;

  enemies = structuredClone(initialEnemies);
  gameOver = false;
  jumpKeyRelease = true;
}

function updateChar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (leftDown) {
    vx = -speed;
    facingLeft = true;
  }

  if (rightDown) {
    vx = speed;
    facingLeft = false;
  }

  drawBackground();

  if (!gameOver) {
    vx = 0;
    if (leftDown) vx = -speed;
    if (rightDown) vx = speed;
    if (attacking) vx = 0;

    x += vx;
    vy += gravity;

    isTouchingWall();

    if (onWall && !grounded && vy > 0) {
      vy = wallSlideGravity;
      if (vy > wallSlideMaxSpeed) vy = wallSlideMaxSpeed;
      if (onWall) {
        if (wallDir === -1) x += 0.5;
        else if (wallDir === 1) x -= 0.5;
      }
    }

    let newX = x + vx;
    let newY = y + vy;

    let horizontalRect = { x: newX, y, width, height };

    for (let i = 0; i < blocks.length; i++) {
      let borderRect = {
        x: blocks[i].x,
        y: blocks[i].y,
        width: blocks[i].width,
        height: blocks[i].height
      };

      if (checkIntersections(horizontalRect, borderRect) && y + height > borderRect.y) {
        const dirX = Math.sign(vx) || 1;
        let attempts = 0;
        while (checkIntersections(horizontalRect, borderRect) && attempts < 50) {
          horizontalRect.x -= dirX;
          attempts++;
        }
        newX = horizontalRect.x;
        vx = 0;
      }
    }

    let verticalRect = { x: newX, y: newY, width, height };

    grounded = false;
    for (let i = 0; i < blocks.length; i++) {
      let borderRect = {
        x: blocks[i].x,
        y: blocks[i].y,
        width: blocks[i].width,
        height: blocks[i].height
      };

      if (checkIntersections(verticalRect, borderRect)) {
        const dirY = Math.sign(vy) || 1;
        let attempts = 0;
        while (checkIntersections(verticalRect, borderRect) && attempts < 50) {
          verticalRect.y -= dirY;
          attempts++;
        }
        newY = verticalRect.y;
        vy = 0;

        if (dirY > 0) {
          grounded = true;
          jumpCount = 0;
          onWall = false;
        }
      }
    }

    x = newX;
    y = newY;

    collision();

    const centerX = canvas.width / 2;
    xScreen = x - scrollX;

    if (xScreen > centerX + 200) {
      scrollX += xScreen - (centerX + 200);
      xScreen = centerX + 200;
    }

    if (xScreen < centerX - 200) {
      scrollX += xScreen - (centerX - 200);
      xScreen = centerX - 200;
    }

    updateAnimation();
    drawEnemies();
    drawPlayer();
    enemyCollision();
    enemies = enemies.filter(e => e.health > 0);

    drawBlocks();
    drawObjects();

    drawHUD();
  } else {
    updateAnimation();
    drawPlayer();
    drawGameOver();
  }

  updateEnemies();

  requestAnimationFrame(updateChar);
}

// Initialize animations
setAnimation("idle");

// Start game loop
updateChar();