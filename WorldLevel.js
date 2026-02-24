class WorldLevel {
  constructor(json) {
    // Keep the raw json around (useful for debugging / teaching)
    this.schemaVersion = json.schemaVersion ?? 1;

    this.w = json.world?.w ?? 2400;
    this.h = json.world?.h ?? 1600;

    // Background color as [r,g,b]
    this.bg = json.world?.bg ?? [235, 235, 235];

    // Grid step (spacing between lines)
    this.gridStep = json.world?.gridStep ?? 160;

    // Obstacles: list of rects
    this.obstacles = json.obstacles ?? [];

    this.symbols = [];

    for (let i = 0; i < 20; i++) {
      this.symbols.push({
        x: random(this.w),
        y: random(this.h),
        size: random(8, 16),
      });
    }
  }

  drawBackground() {
    for (let i = 0; i < height; i++) {
      let inter = map(i, 0, height, 0, 1);
      let c = lerpColor(color(245, 248, 255), color(225, 235, 250), inter);
      stroke(c);
      line(0, i, width, i);
    }
  }

  // Draw the world in WORLD coordinates (caller should translate camera first)
  drawWorld() {
    // World “paper”
    noStroke();
    fill(this.bg[0], this.bg[1], this.bg[2]);
    rect(0, 0, this.w, this.h);

    // Grid
    stroke(240, 240, 240, 80);
    for (let x = 0; x <= this.w; x += this.gridStep) line(x, 0, x, this.h);
    for (let y = 0; y <= this.h; y += this.gridStep) line(0, y, this.w, y);

    // far layer (moves slowest)
    push();
    translate(camX * 0.2, camY * 0.2);
    noStroke();
    fill(240, 245, 255, 120);
    ellipse(this.w * 0.3, this.h * 0.3, 600, 400);
    ellipse(this.w * 0.7, this.h * 0.6, 500, 350);
    pop();

    // mid layer
    push();
    translate(camX * 0.5, camY * 0.5);
    fill(220, 235, 255, 90);
    ellipse(this.w * 0.5, this.h * 0.4, 400, 300);
    pop();

    // Obstacles (soft floating forms)
    noStroke();
    for (const o of this.obstacles) {
      push();
      translate(o.x + o.w / 2, o.y + o.h / 2);

      let wobble = sin(frameCount * 0.01 + o.x) * 3;

      fill(200, 220, 255, 120);
      ellipse(0, 0, o.w + wobble, o.h + wobble);

      pop();
    }

    // hidden symbols
    for (const s of this.symbols) {
      let distToCam = dist(s.x, s.y, camX + width / 2, camY + height / 2);

      let alpha = map(distToCam, 0, 400, 200, 0);
      alpha = constrain(alpha, 0, 200);

      noStroke();
      fill(120, 160, 255, alpha);

      ellipse(s.x, s.y, s.size);
      let pulse = sin(frameCount * 0.05 + s.x) * 2;

      ellipse(s.x, s.y, s.size + pulse);

      //halo
      fill(120, 160, 255, alpha * 0.2);
      ellipse(s.x, s.y, s.size * 3);
    }
  }

  drawHUD(player, camX, camY) {
    noStroke();
    fill(20);
    text("Example 3 — JSON world. WASD/Arrows. Press R to reset.", 12, 20);
    text(
      "Player(world): " +
        (player.x | 0) +
        ", " +
        (player.y | 0) +
        "   Cam(world): " +
        (camX | 0) +
        ", " +
        (camY | 0),
      12,
      40,
    );
  }
}
