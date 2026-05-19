const coinImg = new Image();
coinImg.src = "fantasy/Objects/coin-placeholder.png"; // placeholder path for a coin image

let coins = [];
const coinSize = 32;

function spawnCoin(x, y) {
    coins.push({
    x: x - coinSize / 2,
    y: y - coinSize / 2,
    width: coinSize,
    height: coinSize,
    collected: false
    });
}

function drawCoins() {
    for (const coin of coins) {
    if (coin.collected) continue;

    const drawX = coin.x - scrollX;
    const drawY = coin.y;

    if (coinImg.complete && coinImg.naturalWidth > 0) {
        ctx.drawImage(coinImg, 0, 0, coinImg.naturalWidth, coinImg.naturalHeight, drawX, drawY, coin.width, coin.height);
    } else {
        ctx.save();
        ctx.fillStyle = "#ffcc00";
        ctx.strokeStyle = "#aa8800";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(drawX + coin.width / 2, drawY + coin.height / 2, coin.width / 2, coin.height / 2.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        }
}
}
