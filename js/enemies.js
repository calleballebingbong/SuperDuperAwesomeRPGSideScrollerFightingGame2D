const enemyImages = {
  boar: boarWalkImg,
};

let initialEnemies = [
  {
    type: "boar",
    maxHealth: 20,
    health: 20,
    x: 300,
    y: floor + height - 50,
    width: 80,
    height: 80,
    speed: 1,
    direction: 1,
    startX: 300,
    endX: 1000,
    vy: 0,
    grounded: true,
    lastHitTime: 0,
    frameWidth: (192/4) - 0.5,
    frameHeight: 32,
    frameY: 0,
    frameCount: 4,
    currentFrame: 0,
  },
  {
    type: "boar",
    maxHealth: 20,
    health: 20,
    x: 200,
    y: 400-height,
    width: 80,
    height: 80,
    speed: 1,
    direction: -1,
    startX: 150,
    endX: 550,
    vy: 0,
    grounded: true,
    lastHitTime: 0,
    frameWidth: (192/4)-0.5,
    frameHeight: 32,
    frameY: 0,
    frameCount: 4,
    currentFrame: 0,
  },
  {
    type: "boar",
    maxHealth: 20,
    health: 20,
    x: 400,
    y: 350-height,
    width: 80,
    height: 80,
    speed: 1,
    direction: 1,
    startX: 400,
    endX: 600,
    vy: 0,
    grounded: true,
    lastHitTime: 0,
    frameWidth: (192/4)-0.5,
    frameHeight: 32,
    frameY: 0,
    frameCount: 4,
    currentFrame: 0,
  }
];

let enemies = structuredClone(initialEnemies);

function updateEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    e.x += e.speed * e.direction;

    if (e.x <= e.startX) e.direction = 1;
    else if (e.x + e.width >= e.endX) e.direction = -1;

    e.vy += gravity;
    e.y += e.vy;

    e.grounded = false;

    for (let j = 0; j < blocks.length; j++) {
      const b = blocks[j];
      if (
        e.x + e.width / 2 >= b.x - e.width / 2 &&
        e.x + e.width / 2 <= b.x + b.width &&
        e.y + e.height >= b.y &&
        e.y + e.height <= b.y + b.height
      ) {
        e.y = b.y - e.height;
        e.vy = 0;
        e.grounded = true;
      }
    }

    if (e.y + e.height >= canvas.height) {
      e.y = canvas.height - e.height;
      e.vy = 0;
      e.grounded = true;
    }

    e.frameTick = (e.frameTick || 0) + 1;
    if (e.frameTick >= 10) {
      e.currentFrame = (e.currentFrame + 1) % e.frameCount;
      e.frameTick = 0;
    }
  }
}

function drawEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    const img = enemyImages[e.type];

    if (img && img.complete && img.naturalWidth > 0) {
      const sx = e.currentFrame * e.frameWidth;
      const sy = e.frameY;
      const sw = e.frameWidth;
      const sh = e.frameHeight;
      const dw = e.width;
      const dh = e.height;
      const dx = e.x - scrollX;
      const dy = e.y;

      ctx.save();

      if (e.direction === 1) {
        ctx.translate(dx + dw, dy);
        ctx.scale(-1, 1);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
      } else {
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
      }

      ctx.restore();
    }
  }

  // Enemy health bars
  const now = Date.now();
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    const timeSinceHit = now - e.lastHitTime;
    if (timeSinceHit < 2000) {
      const barX = e.x - scrollX + e.width / 2;
      const barY = e.y - 20;
      const barWidth = 40;
      const barHeight = 6;

      ctx.fillStyle = "red";
      ctx.fillRect(barX - barWidth / 2, barY, barWidth, barHeight);

      const healthPercent = e.health / e.maxHealth;
      ctx.fillStyle = "lime";
      ctx.fillRect(barX - barWidth / 2, barY, barWidth * healthPercent, barHeight);

      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.strokeRect(barX - barWidth / 2, barY, barWidth, barHeight);
    }
  }
}

function enemyCollision() {
  const now = Date.now();

  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    const ex = e.x;
    const ey = e.y;
    const ew = e.width;
    const eh = e.height;

    const px = x;
    const py = y;
    const pw = width;
    const ph = height;

    if (px + pw > ex &&
      px < ex + ew &&
      py + ph > ey &&
      py < ey + eh
    ){
      if (!invincible) {
        health -= 10;
        invincible = true;
        lastDamageTime = now;

        setTimeout(() => {
          invincible = false;
        }, damageCooldown);
      }

      if (health <= 0) {
        health = 0;
        gameOver = true;
      }
    }
  }
}