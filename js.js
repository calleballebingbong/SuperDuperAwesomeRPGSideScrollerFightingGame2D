
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

const width = 50;
const height = 100;
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

let enemies = [
  {
    x: 300,
    y: floor + height - 50,
    width: 50,
    height: 50,
    speed: 1.5,
    direction: 1,
    startX: 300,
    endX: 1000,
    vy: 0,
    grounded: true,
  },
  {
    x: 200,
    y: 400-50,
    width: 50,
    height: 50,
    speed: 1.5,
    direction: -1,
    startX: 150,
    endX: 550,
    vy: 0,
    grounded: true,
  },
  {
    x: 400,
    y: 350-50,
    width: 50,
    height: 50,
    speed: 1.5,
    direction: 1,
    startX: 400,
    endX: 600,
    vy: 0,
    grounded: true,
  }

];

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
        health = maxHealth; // reset health **change to game over screen later**
        x = 0;
        y = floor;
        vy = 0;

      }
    }
  }
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

const treeImg = new Image();
treeImg.src = "fantasy/Trees/Green-Tree.png";
const treeSprites = [
  { sx: 0, sy: 0, sw: 112, sh: 256 },   // first tree
  { sx: 256, sy: 0, sw: 256, sh: 256 }, // second tree
];

const rockImg = new Image();
rockImg.src = "fantasy/Trees/Rock.png";
const rockSprites = [
  { sx: 0, sy: 0, sw: 900, sh: 500 }
];

function updateChar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  vx = 0;
  if (leftDown) vx = -speed;
  if (rightDown) vx = speed;

  x += vx;

  vy += gravity;

  isTouchingWall();

  //wall sliding
  if (onWall && !grounded && vy > 0) {
    vy = wallSlideGravity;
    if (vy > wallSlideMaxSpeed) {
      vy = wallSlideMaxSpeed;
    }
    if (onWall){
      if (wallDir === -1) {
        x += 0.5;
      } else if (wallDir === 1) {
        x -= 0.5;
      }
    }
  }

  // calculate intended positions
  let newX = x + vx;
  let newY = y + vy;

  // horizontal collision
  let horizontalRect = {
    x: newX,
    y: y,
    width: width,
    height: height
  };

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

  // vertical collision
  let verticalRect = {
    x: newX,
    y: newY,
    width: width,
    height: height
  };

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

  // update positions
  x = newX;
  y = newY;

  // floor collision
  collision();

    const centerX = canvas.width/ 2;

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

    // horizontal movement (path)
    e.x += e.speed * e.direction;

    // path boundaries (startX / endX)
    if (e.x <= e.startX) {
      e.direction = 1;
    } else if (e.x + e.width >= e.endX) {
      e.direction = -1;
    }

    // gravity
    e.vy += gravity;
    e.y += e.vy;

    // reset grounded
    e.grounded = false;

    // check blocks for ground under enemy
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

    // floor collision for enemy
    if (e.y + e.height >= canvas.height) {
      e.y = canvas.height - e.height;
      e.vy = 0;
      e.grounded = true;
    }
  }

  // enemy collision
  enemyCollision();

  // draw blocks
  ctx.fillStyle = "black";
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    ctx.fillRect(block.x - scrollX, block.y, block.width, block.height);
  }

  // draw enemies
  ctx.fillStyle = "red";
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    ctx.fillRect(e.x - scrollX, e.y, e.width, e.height);
  }


  // draw player
  ctx.fillStyle = "blue";
  ctx.fillRect(xScreen, y, width, height);


  // draw health bar
    const barWidth = 180;
  const barHeight = 16;
  const barX = 20;
  const barY = 20;

  ctx.fillStyle = "red";
  ctx.fillRect(barX, barY, barWidth, barHeight);

  ctx.fillStyle = "lime";
  ctx.fillRect(barX, barY, barWidth * (health / maxHealth), barHeight);

  ctx.strokeStyle = "black";
  ctx.strokeRect(barX, barY, barWidth, barHeight);

    // draw rocks
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

  // draw trees
  if (treeImg.complete && treeImg.naturalWidth > 0) {
    for (let i = 0; i < trees.length; i++) {
      const tree = trees[i];
      ctx.drawImage(
        treeImg,
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

  requestAnimationFrame(updateChar);
}

enemyCollision();


updateChar();