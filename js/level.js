// Platforms
let blocks = [
  {x: 100, y: 400, width: 200, height: 20},
  {x: 400, y: 350, width: 200, height: 20},
  {x: 700, y: 300, width: 100, height: 20},
  {x: 900, y: 250, width: 20, height: 150},
  {x: 1150, y: 100, width: 20, height: 150},
];

// Trees
let trees = [
  {x: 1100, y: -100, width: 300, height: 700},
  {x: 1300, y: 0, width: 300, height: 600},
  {x: 1400, y: -100, width: 300, height: 700},
];

const treeSprites = [
  { sx: 0, sy: 0, sw: 112, sh: 256 },   // first tree
  { sx: 256, sy: 0, sw: 256, sh: 256 }, // second tree
];

// Rocks
let rocks = [
  {x: 500, y: floor + height - 70, width: 200, height: 100},
  {x: 1250, y: floor + height - 70, width: 200, height: 100},
];

const rockSprites = [
  { sx: 0, sy: 0, sw: 900, sh: 500 }
];

function drawBlocks() {
  ctx.fillStyle = "black";
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    ctx.fillRect(block.x - scrollX, block.y, block.width, block.height);
  }
}

function drawObjects() {
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
}