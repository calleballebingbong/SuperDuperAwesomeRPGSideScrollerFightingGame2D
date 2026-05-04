// Player variables
let x = 0;
let y = 0;
let vx = 0;
let vy = 0;
let grounded = false;
let jumpCount = 0;
let onWall = false;
let wallDir = 0; // -1 for left wall, 1 for right wall
let jumpKeyRelease = true;
let invincible = false;
let health = maxHealth;
let lastDamageTime = 0;
let isAttacking = false;
let lastAttackTime = 0;

// Animation variables
let frameTimer = 0;
let facingLeft = false;
let currentAnim = null;
let frameIndex = 0;
let spriteWidth = 0;
let spriteOffsetX = 0;
let imageLoaded = false;
let attacking = false;

const animations = {
  idle: {
    src: "fantasy/Character/Idle/Idle-Sheet.png",
    frames: 4,
    loop: true,
    frameWidth: 256 / 4
  },
  run: {
    src: "fantasy/Character/Run/Run-Sheet.png",
    frames: 8,
    loop: true,
    frameWidth: 640 / 8
  },
  attack: {
    src: "fantasy/Character/Attack-01/Attack-01-Sheet.png",
    frames: 8,
    loop: false,
    frameWidth: 768 / 8
  },
  jumpStart: {
    src: "fantasy/Character/Jump-Start/Jump-Start-Sheet.png",
    frames: 4,
    loop: false,
    frameWidth: 256 / 4
  },
  jumpEnd: {
    src: "fantasy/Character/Jump-End/Jump-End-Sheet.png",
    frames: 3,
    loop: false,
    frameWidth: 192 / 3
  },
  dead: {
    src: "fantasy/Character/Dead/Dead-Sheet.png",
    frames: 8,
    loop: false,
    frameWidth: 640 / 8
  }
};

const spriteSheet = new Image();

function setAnimation(name) {
  const anim = animations[name];
  if (!anim || currentAnim === anim) return;

  currentAnim = anim;
  frameIndex = 0;
  imageLoaded = false;

  spriteSheet.onload = () => {
    imageLoaded = true;
  };

  spriteSheet.src = anim.src;
  spriteWidth = anim.frameWidth;
}

function updateAnimation() {
  if (gameOver) {
    setAnimation("dead");
    return;
  }
  if (!grounded) {
    // going UP
    if (vy < 0) {
      if (currentAnim !== animations.jumpStart) {
        setAnimation("jumpStart");
      }
    }
    // going DOWN
    else if (vy > 0) {
      if (currentAnim !== animations.jumpEnd && onWall == false) {
        setAnimation("jumpEnd");
      }
    }
  }
  else if (attacking) {
    setAnimation("attack");
  }
  else if (vx !== 0) {
    setAnimation("run");
  }
  else {
    setAnimation("idle");
  }
}

function drawPlayer() {
  if (spriteSheet.naturalWidth > 0) {
    if (currentAnim === animations.run) {
      spriteDrawWidth = currentAnim.frameWidth * 2.5;
      spriteOffsetX = -20;
    } else if (currentAnim === animations.attack) {
      spriteDrawWidth = currentAnim.frameWidth * 2.5;
      spriteOffsetX = -30;
    } else if (onWall) {
      spriteOffsetX = 20;
    } else {
      spriteDrawWidth = 150;
      spriteOffsetX = 0;
    }

    ctx.save();

    // sprite anchor = CENTER of hitbox
    const centerX = xScreen + width / 2;

    // flip if facing left
    if (facingLeft) {
      ctx.translate(centerX, 0);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(centerX, 0);
    }
    // ALWAYS draw sprite centered on same anchor
    ctx.drawImage(
      spriteSheet,
      frameIndex * spriteWidth,
      0,
      spriteWidth,
      spriteHeight,
      spriteX + spriteOffsetX,
      y + height - spriteDrawHeight,
      spriteDrawWidth,
      spriteDrawHeight
    );

    ctx.restore();
  }

  // DEBUG HITBOX
  ctx.strokeStyle = "lime";
  ctx.lineWidth = 2;
  ctx.strokeRect(xScreen, y, width, height);

  frameTimer++;
  if (frameTimer >= frameDelay) {
    frameTimer = 0;
    frameIndex++;
    if (frameIndex >= currentAnim.frames) {
      if (currentAnim.loop) {
        frameIndex = 0;
      } else {
        frameIndex = currentAnim.frames - 1; // hold last frame
        attacking = false; // reset attack state after animation finishes
      }
    }
  }
}

function playerAttack() {
  const hitThisFrame = new Set();
  const now = Date.now();
  lastAttackTime = now;
  isAttacking = true;

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

    if (px + pw + playerRange > ex &&
      px - playerRange < ex + ew &&
      py + ph > ey && py < ey + eh) {
      e.health -= playerDamage;
      e.lastHitTime = now;
      hitThisFrame.add(i);
    }
  }
  window.hitEnemiesThisFrame = Array.from(hitThisFrame);
}