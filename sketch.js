/*
Week 5 — Example 3: Data-driven world with JSON + WorldLevel class

Course: GBDA302 | Instructors: Dr. Karen Cochrane & David Han
Date: Feb. 12, 2026

Move: WASD/Arrows

Learning goals:
- Load world data from an external JSON file (preload + loadJSON)
- Keep Level and Player as external classes (WorldLevel.js, Player.js)
- Separate game state (world/player) from view state (camera)
- Keep the player visible on screen (camera clamp + player clamp)
*/

const VIEW_W = 800;
const VIEW_H = 480;

let worldData; // raw JSON
let level; // WorldLevel instance
let player; // Player instance

let camX = 0; // camera top-left in WORLD coords
let camY = 0;

function preload() {
  worldData = loadJSON("world.json");
}

function setup() {
  createCanvas(VIEW_W, VIEW_H);
  textFont("sans-serif");
  textSize(14);

  level = new WorldLevel(worldData);

  const start = worldData.playerStart ?? { x: 300, y: 300, speed: 3 };
  player = new Player(start.x, start.y, start.speed);
}

function draw() {
  // --- game state update ---
  player.updateInput();

  // Keep the player inside the world so they can't run off forever.
  // This also guarantees they can't "leave the camera behind".
  player.x = constrain(player.x, 0, level.w);
  player.y = constrain(player.y, 0, level.h); // constrain() clamps a value between low/high. [web:80]

  // --- view state update (camera) ---
  // Safe camera bounds even if world is smaller than the viewport.
  const maxCamX = max(0, level.w - width);
  const maxCamY = max(0, level.h - height);

  // Center camera on player, then clamp to legal camera range.
  let targetX = player.x - width / 2;
  let targetY = player.y - height / 2;

  // environmental drift
  let envDriftX = sin(frameCount * 0.002) * 120;
  let envDriftY = cos(frameCount * 0.0015) * 90;

  targetX += envDriftX;
  targetY += envDriftY;

  targetX = constrain(targetX, 0, maxCamX);
  targetY = constrain(targetY, 0, maxCamY);

  // slower emotional lag
  camX = lerp(camX, targetX, 0.01);
  camY = lerp(camY, targetY, 0.01);

  // --- draw ---
  level.drawBackground();

  // World + player are drawn in WORLD space (translated by camera).
  push();
  translate(-camX, -camY);
  level.drawWorld();
  player.draw();
  pop();

  // soft edge fade
  noStroke();
  for (let i = 0; i < 80; i++) {
    fill(0, 0, 0, i * 0.8);
    rect(i, 0, 1, height);
    rect(width - i, 0, 1, height);
    rect(0, i, width, 1);
    rect(0, height - i, width, 1);
  }

  // HUD is drawn in SCREEN space (no camera translation).
  level.drawHUD(player, camX, camY);
}

function keyPressed() {
  if (key === "r" || key === "R") {
    const start = worldData.playerStart ?? { x: 300, y: 300, speed: 3 };
    player = new Player(start.x, start.y, start.speed);
  }
}
