
const canvas = document.getElementById("canvas")
canvas.width = 1200
canvas.height = 550
const ctx = canvas.getContext("2d")

if (!canvas) {
  console.error("Canvas element not found! Check HTML: <canvas id='canvas'>");
}

if (!ctx) {
  console.error("ctx is null — canvas.getContext failed?");
}

let x = 0;
let y = 0;
let scrollX = 0;
let xScreen = 0;
let leftDown = false;
let rightDown = false;
let vx = 0;
let vy = 0;
let grounded = false;
let jumpCount = 0;
let maxJumps = 2;
let gameOver = false;

const width = 50;
const height = 150;
const offsetY = -10;
const offsetX = 10;


const gravity = 1;
const speed = 5;
const floor = canvas.height - height;

const wallSlideGravity = 2;
const wallSlideMaxSpeed = 4;
let onWall = false;
let wallDir = 0; // -1 for left wall, 1 for right wall
let jumpKeyRelease = true;

let invincible = false;
let maxHealth = 100;
let health = maxHealth;
let damageCooldown = 500; //ms
let lastDamageTime = 0;

let playerDamage = 10;
const playerRange = 50; // range of player attack
let isAttacking = false;
let attackCooldown = 250; // ms
let lastAttackTime = 0;

// animation variables:
let frameTimer = 0;
let frameDelay = 5; // higher = slower animation
let spriteDrawWidth = 150;
let spriteDrawHeight = 200;
let spriteX = -spriteDrawWidth / 2
let spriteOffsetX = 0;
let facingLeft = false;


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
  }
};



const spriteImages = {
  idle: new Image(),
  run: new Image(),
  attack: new Image(),
  jumpStart: new Image(),
  jumpEnd: new Image()
};

spriteImages.idle.src = animations.idle.src;
spriteImages.run.src = animations.run.src;
spriteImages.attack.src = animations.attack.src;
spriteImages.jumpStart.src = animations.jumpStart.src;
spriteImages.jumpEnd.src = animations.jumpEnd.src;
const spriteSheet = new Image();

let currentAnim = null;
let frameIndex = 0;

let spriteWidth = 0;
const spriteHeight = 64;

let imageLoaded = false;

currentAnim = animations.idle;
setAnimation("idle");

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

attacking = false;
document.addEventListener("keydown", (event) => {
  if (event.code === "KeyL") {
    attacking = true;
  }

  if (event.code === "Space") {
    setAnimation("jump");
  }
});


const boarWalkImg = new Image();
boarWalkImg.src = "fantasy/Mob/Boar/Walk/Walk-Base-Sheet.png";

const treeImg = new Image();
treeImg.src = "fantasy/Trees/Background.png";

const darkTreeImg = new Image();
darkTreeImg.src = "fantasy/Trees/Background.png";

const mountainImg = new Image();
mountainImg.src = "fantasy/Trees/Background.png";

const darkMountainImg = new Image();
darkMountainImg.src = "fantasy/Trees/Background.png";

const treeSlices = [
  { sx: 350, sy: 0, sw: 100, sh: 256 },
  { sx: 463, sy: 0, sw: 100, sh: 256 },
  { sx: 576, sy: 0, sw: 124, sh: 256 },
];

const darkTreeSlices = [
  { sx: -1, sy: 0, sw: 100, sh: 256 },
  { sx: 112, sy: 0, sw: 100, sh: 256 },
  { sx: 224, sy: 0, sw: 125, sh: 256 },
];

const darkMountainSlices = [
  { sx: 701.85, sy: 0, sw: 99, sh: 256 },
]

const mountainSlices = [
  { sx: 801, sy: 0, sw: 97.85, sh: 256 },
]

function drawTreeLayer(speed, yOffset, scale, alpha = 1) {
  if (!treeImg.complete || treeImg.naturalWidth === 0) return;

  ctx.save();
  ctx.globalAlpha = alpha;

  const overlap = 4;
  let layerWidth = 0;
  const parts = [];

  for (const s of treeSlices) {
    const dw = s.sw * scale;
    const dh = s.sh * scale;
    parts.push({ ...s, dw, dh });
    layerWidth += dw - overlap;
  }

  const startX = -((scrollX * speed) % layerWidth);

  for (let xPos = startX - layerWidth; xPos < canvas.width + layerWidth; xPos += layerWidth) {
    let dx = xPos;
    for (const p of parts) {
      const treeY = canvas.height - p.dh + yOffset;
      ctx.drawImage(treeImg, p.sx, p.sy, p.sw, p.sh, dx, treeY, p.dw, p.dh);
      dx += p.dw - overlap;
    }
  }

  ctx.restore();
}

function drawDarkTreeLayer(speed, yOffset, scale, alpha = 1) {
  if (!darkTreeImg.complete || darkTreeImg.naturalWidth === 0) return;

  ctx.save();
  ctx.globalAlpha = alpha;

  const overlap = 4;
  let layerWidth = 0;
  const parts = [];

  for (const s of darkTreeSlices) {
    const dw = s.sw * scale;
    const dh = s.sh * scale;
    parts.push({ ...s, dw, dh });
    layerWidth += dw - overlap;
  }

  const startX = -((scrollX * speed) % layerWidth);

  for (let xPos = startX - layerWidth; xPos < canvas.width + layerWidth; xPos += layerWidth) {
    let dx = xPos;
    for (const p of parts) {
      const treeY = canvas.height - p.dh + yOffset;
      ctx.drawImage(darkTreeImg, p.sx, p.sy, p.sw, p.sh, dx, treeY, p.dw, p.dh);
      dx += p.dw - overlap;
    }
  }

  ctx.restore();
}

function drawMountainLayer(speed, yOffset, scale, alpha = 1) {
  if (!mountainImg.complete || mountainImg.naturalWidth === 0) return;

  ctx.save();
  ctx.globalAlpha = alpha;

  const overlap = 4;
  let layerWidth = 0;
  const parts = [];

  for (const s of mountainSlices) {
    const dw = s.sw * scale;
    const dh = s.sh * scale;
    parts.push({ ...s, dw, dh });
    layerWidth += dw - overlap;
  }

  const startX = -((scrollX * speed) % layerWidth);

  for (let xPos = startX - layerWidth; xPos < canvas.width + layerWidth; xPos += layerWidth) {
    let dx = xPos;

    for (const p of parts) {
      const mountainY = canvas.height - p.dh + yOffset;
      ctx.drawImage(mountainImg, p.sx, p.sy, p.sw, p.sh, dx, mountainY, p.dw, p.dh);
      dx += p.dw - overlap;
    }
  }

  ctx.restore();
}

function drawDarkMountainLayer(speed, yOffset, scale, alpha = 1) {
  if (!darkMountainImg.complete || darkMountainImg.naturalWidth === 0) return;

  ctx.save();
  ctx.globalAlpha = alpha;

  const overlap = 4;
  let layerWidth = 0;
  const parts = [];

  for (const s of darkMountainSlices) {
    const dw = s.sw * scale;
    const dh = s.sh * scale;
    parts.push({ ...s, dw, dh });
    layerWidth += dw - overlap;
  }

  const startX = -((scrollX * speed) % layerWidth);

  for (let xPos = startX - layerWidth; xPos < canvas.width + layerWidth; xPos += layerWidth) {
    let dx = xPos;

    for (const p of parts) {
      const mountainY = canvas.height - p.dh + yOffset;
      ctx.drawImage(darkMountainImg, p.sx, p.sy, p.sw, p.sh, dx, mountainY, p.dw, p.dh);
      dx += p.dw - overlap;
    }
  }

  ctx.restore();
}

const bgImg = new Image();
bgImg.src = "fantasy/Background/Background.png";

function drawBackground() {
  ctx.fillStyle = "#93e3e4";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (bgImg.complete && bgImg.naturalWidth > 0) {
    const bgSpeed = 0.1;
    const bgWidth = canvas.width * 2;
    const x1 = -(scrollX * bgSpeed) % bgWidth;


    drawMountainLayer(0.01, -50, 1.4, 0.70)
    drawDarkMountainLayer(0.03, -30, 1.2, 1);
    drawDarkMountainLayer(0.09,20,0.8, 1)
    drawTreeLayer(0.12, 0, 0.8, 1);
    drawDarkTreeLayer(0.17, 10, 0.9, 0.95)
    drawTreeLayer(0.22, 20, 1.0, 0.95);
    drawDarkTreeLayer(0.28, 30, 1.1, 0.96);
    drawTreeLayer(0.35, 40, 1.2, 0.97);
    ctx.save();
    ctx.globalAlpha = 0.75;
    ctx.drawImage(bgImg, x1 - 500, 0, bgWidth, canvas.height);
    ctx.drawImage(bgImg, x1 + bgWidth - 500, 0, bgWidth, canvas.height);
    ctx.restore();
  }
}

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

function drawGameOver() {
  if (!gameOver) return;

  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);

  ctx.font = "24px Arial";
  ctx.fillText("Press R to Restart", canvas.width / 2, canvas.height / 2 + 20);
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
      invincible = true
      lastDamageTime = now

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
  //blocks
  let blocks = [
    {x: 100, y: 400, width: 200, height: 20},
    {x: 400, y: 350, width: 200, height: 20},
    {x: 700, y: 300, width: 100, height: 20},
    {x: 900, y: 250, width: 20, height: 150},
    {x: 1150, y: 100, width: 20, height: 150}, 
  ];

function collision() {
  if (y >= canvas.height - height) {
    y = canvas.height - height;
    grounded = true;
    vy = 0;
    jumpCount = 0;
    onWall = false;
  }
}

function checkIntersections(rect1, rect2) {
  if (rect1.x >= rect2.x + rect2.width) {
    return false;
  }else if (rect1.x + rect1.width <= rect2.x) {
    return false;
  }else if (rect1.y >= rect2.y + rect2.height) {
    return false;
  }else if (rect1.y + rect1.height <= rect2.y) {
    return false;
  } else {
    return true;
  }
}

function isTouchingWall() {
  const margin = 1;

  const leftRect = {
    x: x- margin,
    y: y + 10,
    width: margin,
    height: height - 20
  };
  
  const rightRect = {
    x: x + width,
    y: y + 10,
    width: margin,
    height: height - 20
  };

  let hitLeft = false;
  let hitRight = false;

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const blockRect = {
      x: b.x,
      y: b.y,
      width: b.width,
      height: b.height
    };
    if (checkIntersections(leftRect, blockRect)) hitLeft = true;
    if (checkIntersections(rightRect, blockRect)) hitRight = true;
  }

  if (hitLeft && hitRight) {
    onWall = true;
    wallDir = 0;
    return true;
  } else if (hitLeft) {
    onWall = true;
    wallDir = -1;
    return true;
  } else if (hitRight) {
    onWall = true;
    wallDir = 1;
    return true;
  } else {
    onWall = false;
    wallDir = 0;
    return false;
  }
}

let trees = [
  {x: 1100, y: -100, width: 300, height: 700},
  {x: 1300, y: 0, width: 300, height: 600},
  {x: 1400, y: -100, width: 300, height: 700},
];

let rocks = [
  {x: 500, y: floor + height - 70, width: 200, height: 100},
  {x: 1250, y: floor + height - 70, width: 200, height: 100},
];

const treeObjImg = new Image();
treeObjImg.src = "fantasy/Trees/Green-Tree.png";
const treeSprites = [
  { sx: 0, sy: 0, sw: 112, sh: 256 },   // first tree
  { sx: 256, sy: 0, sw: 256, sh: 256 }, // second tree
];

const rockImg = new Image();
rockImg.src = "fantasy/Trees/Rock.png";
const rockSprites = [
  { sx: 0, sy: 0, sw: 900, sh: 500 }
];

const playerIconImg = new Image();
playerIconImg.src = "fantasy/HUD/Base-01.png";
const playerIcon = 
  { sx: 95, sy: 62, sw: 32, sh: 32 }
;

const healthBarImg = new Image();
healthBarImg.src = "fantasy/HUD/Base-01.png";
const healthBar = 
  { sx: 243, sy: 107, sw: 58, sh: 27 }
;

const playerPortraitImg = new Image();
playerPortraitImg.src = "fantasy/portraits/playerIcon.png";

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
        while (checkIntersections(horizontalRect, borderRect)) {
          horizontalRect.x -= dirX;
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
        while (checkIntersections(verticalRect, borderRect)) {
          verticalRect.y -= dirY;
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

    enemyCollision();
    enemies = enemies.filter(e => e.health > 0);

    ctx.fillStyle = "black";
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      ctx.fillRect(block.x - scrollX, block.y, block.width, block.height);
    }

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


    if (rockImg.complete && rockImg.naturalWidth > 0) {
      for (let i = 0; i < rocks.length; i++) {
        const rock = rocks[i];
        ctx.drawImage(
          rockImg,
          rockSprites[0].sx,
          rockSprites[0].sy,
          rockSprites[0].sw,
          rockSprites[0].sh,
          rock.x - scrollX,
          rock.y,
          rock.width,
          rock.height
        );
      }
    }

    if (treeObjImg.complete && treeObjImg.naturalWidth > 0) {
      for (let i = 0; i < trees.length; i++) {
        const tree = trees[i];
        ctx.drawImage(
          treeObjImg,
          treeSprites[0].sx,
          treeSprites[0].sy,
          treeSprites[0].sw,
          treeSprites[0].sh,
          tree.x - scrollX,
          tree.y,
          tree.width,
          tree.height
        );
      }
    }

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

    if (playerPortraitImg.complete && playerPortraitImg.naturalWidth > 0) {
      ctx.strokeStyle = "darkgreen";
      ctx.fillStyle = "rgba(0, 128, 0, 0.5)";
      ctx.fillRect(12, 15, 70, 70);
      ctx.drawImage(playerPortraitImg, 13, 16, 68, 68);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(12, 15, 70, 70, 10);
      ctx.stroke();
    }

    ctx.strokeStyle = "darkgreen";
    ctx.fillStyle = "rgba(0, 128, 0, 0.5)";
    ctx.fillRect(95, 13, 300, 68);
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(95, 13, 300, 68, 10);
    ctx.stroke();

    const barWidth = 180;
    const barHeight = 32;
    const barX = 105;
    const barY = 35;
    const radius = 8;
    const healthPercent = health / maxHealth;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(barX, barY, barWidth, barHeight, radius);
    ctx.fillStyle = "red";
    ctx.fill();

    ctx.beginPath();
    ctx.roundRect(barX, barY, barWidth * healthPercent, barHeight, radius);
    ctx.fillStyle = "lime";
    ctx.fill();

    ctx.beginPath();
    ctx.roundRect(barX, barY, barWidth, barHeight, radius);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  } else {
    drawGameOver();
  }
  
if (spriteSheet.naturalWidth > 0) {



if (currentAnim === animations.attack) {
  spriteDrawWidth = currentAnim.frameWidth * 2.5;
  spriteOffsetX = -30;
} else if (onWall) {
  spriteOffsetX = 20;
}
else {
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
function updateAnimation() {
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
  else if (vx !== 0) {
    setAnimation("run");
  }
  else if (attacking) {
    setAnimation("attack");
  }
  else {
    setAnimation("idle");
  }
}
updateAnimation();
  requestAnimationFrame(updateChar);
}

updateChar();