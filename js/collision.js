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