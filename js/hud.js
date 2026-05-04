const playerIcon = 
  { sx: 95, sy: 62, sw: 32, sh: 32 }
;

const healthBar = 
  { sx: 243, sy: 107, sw: 58, sh: 27 }
;

function drawHUD() {
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