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
  
  // DEBUG HITBOX PLAYER
  if (showHitboxes) {
  ctx.strokeStyle = "lime";
  ctx.lineWidth = 2;
  ctx.strokeRect(xScreen, y, width, height);

  //Display game variables (top right corner)
  ctx.fillStyle = "blue";
  ctx.font = "20px Arial";
  ctx.textAlign = "right";
  ctx.fillText(`DMG: ${playerDamage} T/Y, Speed: ${speed} U/I, invincible N: ${invincible}`,canvas.width,20);
  ctx.fillText(`PlayerDamage: ${playerDamage}, PlayerHealth: ${health}`,canvas.width,40);
  ctx.fillText(`BoarDamage: ${boarDamage}`,canvas.width,60);
  ctx.fillText(`Grounded: ${grounded}, OnWall: ${onWall}`,canvas.width,80);
  ctx.fillText(`Attacking: ${attacking}, Moving:  ${moving ? "T" : "F"}`,canvas.width,100);
  } if (!showHitboxes){
      ctx.fillStyle = "red";
      ctx.font = "20px Arial";
      ctx.textAlign = "right";
      ctx.fillText(`Debug Info: B`,canvas.width,20);
  }
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