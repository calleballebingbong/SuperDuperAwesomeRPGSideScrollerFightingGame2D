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
  { sx: 701.85, sy: 0, sw: 99, sh: 256 }
];

const mountainSlices = [
  { sx: 801, sy: 0, sw: 97.85, sh: 256 }
];

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

function drawBackground() {
  ctx.fillStyle = "#93e3e4";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (bgImg.complete && bgImg.naturalWidth > 0) {
    const bgSpeed = 0.1;
    const bgWidth = canvas.width * 2;
    const x1 = -(scrollX * bgSpeed) % bgWidth;

    drawMountainLayer(0.01, -50, 1.4, 0.70);
    drawDarkMountainLayer(0.03, -30, 1.2, 1);
    drawDarkMountainLayer(0.09,20,0.8, 1);
    drawTreeLayer(0.12, 0, 0.8, 1);
    drawDarkTreeLayer(0.17, 10, 0.9, 0.95);
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