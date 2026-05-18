// Game constants
const width = 50;
const height = 150;
let offsetY = -10;
let offsetX = 10;
let gravity = 1;
let speed = 5;
let wallSlideGravity = 2;
let wallSlideMaxSpeed = 4;
let maxJumps = 2;
const maxHealth = 100;
const damageCooldown = 500; // ms
let playerDamage = 5;
let boarDamage = 10;
const playerRange = 50; // range of player attack
const attackCooldown = 750; // ms

//Disable/enable hitboxes and shows more information for debugging
let immune = false;
let showHitboxes = false;

// Movement constants
let moving = false;
let dash = false;
let dashSpeed = 20;
let dashDuration = 150; //ms
let dashCooldown = 500; //ms
let dashStartTime = 0;
let lastDashTime = 0;

// Animation constants
const frameDelay = 5; // higher = slower animation
let spriteDrawWidth = 150;
let spriteDrawHeight = 200;
const spriteX = -spriteDrawWidth / 2;
const spriteHeight = 64;

// Derived constants
const canvasHeight = 550;
const floor = canvasHeight - height;