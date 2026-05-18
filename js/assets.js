// Background images
const bgImg = new Image();
bgImg.src = "fantasy/Background/Background.png";

const treeImg = new Image();
treeImg.src = "fantasy/Trees/Background.png";

const darkTreeImg = new Image();
darkTreeImg.src = "fantasy/Trees/Background.png";

const mountainImg = new Image();
mountainImg.src = "fantasy/Trees/Background.png";

const darkMountainImg = new Image();
darkMountainImg.src = "fantasy/Trees/Background.png";

// Enemy images
const boarWalkImg = new Image();
boarWalkImg.src = "fantasy/Mob/Boar/Walk/Walk-Base-Sheet.png";
const boarRunImg = new Image();
boarRunImg.src = "fantasy/Mob/Boar/Run/Run-Sheet.png"; 
const boarHitImg = new Image();
boarHitImg.src = "fantasy/Mob/Boar/Hit-Vanish/Hit-Sheet.png";

const snailWalkImg = new Image();
snailWalkImg.src = "fantasy/Mob/Snail/walk-Sheet.png";
const snailHitImg = new Image();
snailHitImg.src = "fantasy/Mob/Snail/Hide-Sheet.png";
const snailDieImg = new Image();
snailDieImg.src = "fantasy/Mob/Snail/Dead-Sheet.png";

// NPC images (temporary: reuse boar walk sheet for merchant animation)
const merchantImg = new Image();
merchantImg.src = "fantasy/npc/Characters/idle.png";


// Object images
const treeObjImg = new Image();
treeObjImg.src = "fantasy/Trees/Green-Tree.png";

const rockImg = new Image();
rockImg.src = "fantasy/Trees/Rock.png";

// HUD images
const playerIconImg = new Image();
playerIconImg.src = "fantasy/HUD/Base-01.png";

const healthBarImg = new Image();
healthBarImg.src = "fantasy/HUD/Base-01.png";

const playerPortraitImg = new Image();
playerPortraitImg.src = "fantasy/portraits/playerIcon.png";

//npc
const merchantIdleImg = new Image();
merchantIdleImg.src = "fantasy/npc/Charaters/NPC Merchant-idle.png";

// Audio files
const bgForestMusic = new Audio("audio/forest.mp3");
bgForestMusic.loop = true;
bgForestMusic.volume = 0.3;

const windSound = new Audio("audio/wind.mp3");
windSound.loop = true;
windSound.volume = 0.1;

const birdChirpSound = new Audio("audio/birds.mp3");
birdChirpSound.volume = 0.1;

const walkingSound = new Audio("audio/walking.mp3");
walkingSound.volume = 0.2;

const speak1Sound = new Audio("audio/speak_1.MP3");
speak1Sound.volume = 0.15;