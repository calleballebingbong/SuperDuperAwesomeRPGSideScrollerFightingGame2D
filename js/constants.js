// Game constants
const width = 50;
const height = 150;
let offsetY = -10;
let offsetX = 10;
const gravity = 1;
const speed = 5;
const wallSlideGravity = 2;
const wallSlideMaxSpeed = 4;
const maxJumps = 2;
const maxHealth = 100;
const damageCooldown = 250; // ms
let playerDamage = 5;
const playerRange = 50; // range of player attack
const attackCooldown = 250; // ms

//Disable/enable hitboxes for debugging
let showHitboxes = false;

// Movement constant for dash
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