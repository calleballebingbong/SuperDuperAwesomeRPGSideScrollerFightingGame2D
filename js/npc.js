// Animated NPCs
const npcImages = {
    merchant: { idle: merchantImg }
};

let npcs = [
    {
    id: "shop1",
    type: "merchant",
    x: -300,
    y: floor - height / 3,
    width: 275,
    height: 275,
    frameCount: 8,
    frameWidth: 0,
    frameHeight: 0,
    currentFrame: 0,
    frameTick: 0,
    frameDelay: 10,
    dialogLines: [
        "Welcome, traveler!",
        "I have potions and scrolls for sale.",
        "Press E to continue through the text.",
        "Come back anytime!"
    ],
    dialogIndex: 0,
    chatRadius: 220,
    showBubble: false,
    interacted: false,
    interactPrompt: "Press E to interact"
    }
];

function updateNPCs() {
    for (const n of npcs) {
        n.frameTick++;
        if (n.frameTick >= n.frameDelay) {
            n.currentFrame = (n.currentFrame + 1) % Math.max(1, n.frameCount);
            n.frameTick = 0;
        }

        const dx = x - n.x;
        const dy = y - n.y;
        const distance = Math.hypot(dx, dy);
        n.showBubble = distance <= n.chatRadius;

        if (n.showBubble && interactPressed) {
            if (!n.interacted) {
                n.interacted = true;
                n.dialogIndex = 0;
            } else {
                n.dialogIndex++;
            }

            if (n.dialogIndex >= n.dialogLines.length) {
                n.dialogIndex = 0;
                n.interacted = false;
            }
            interactPressed = false;
        }
    }
}

function drawNPCs(ctx) {
    for (const n of npcs) {
        const img = npcImages[n.type] && npcImages[n.type].idle;
        if (!img || !img.complete) continue;
        if (!n.frameWidth || n.frameWidth <= 0) {
            n.frameWidth = Math.floor(img.naturalWidth / Math.max(1, n.frameCount));
            n.frameHeight = img.naturalHeight;
        }
        const sx = n.currentFrame * n.frameWidth;
        const drawX = n.x - scrollX;
        const drawY = n.y;
        ctx.drawImage(img, sx, 0, n.frameWidth, n.frameHeight, drawX, drawY, n.width, n.height);

        if (n.showBubble) {
            const bubbleText = n.interacted ? n.dialogLines[n.dialogIndex] : n.interactPrompt;
            ctx.font = "20px Arial";
            ctx.textBaseline = "middle";
            const padding = 12;
            const textWidth = ctx.measureText(bubbleText).width;
            const bubbleWidth = textWidth + padding * 2;
            const bubbleHeight = 34;
            const bubbleX = drawX + n.width / 2 - bubbleWidth / 2;
            const bubbleY = drawY - bubbleHeight - 18;

            ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
            ctx.fillRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.strokeRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight);

            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(bubbleText, bubbleX + bubbleWidth / 2, bubbleY + bubbleHeight / 2);
            ctx.textAlign = "left";
        }
    }
}
