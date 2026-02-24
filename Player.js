class Player {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.s = speed ?? 3;
  }

  updateInput() {
    const ax =
      (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) -
      (keyIsDown(LEFT_ARROW) || keyIsDown(65));

    const ay =
      (keyIsDown(DOWN_ARROW) || keyIsDown(83)) -
      (keyIsDown(UP_ARROW) || keyIsDown(87));

    // introduce velocity + easing
    this.vx = lerp(this.vx ?? 0, ax * this.s, 0.05);
    this.vy = lerp(this.vy ?? 0, ay * this.s, 0.05);

    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    noStroke();

    // breathing glow
    let glow = sin(frameCount * 0.05) * 20 + 60;

    // outer aura
    fill(180, 210, 255, 40);
    ellipse(this.x, this.y, glow * 2);

    // mid aura
    fill(160, 200, 255, 80);
    ellipse(this.x, this.y, glow);

    // core
    fill(140, 180, 255, 180);
    ellipse(this.x, this.y, 14);

    // sparkle particles
    for (let i = 0; i < 3; i++) {
      let angle = frameCount * 0.03 + (i * TWO_PI) / 3;
      let r = 18 + sin(frameCount * 0.05 + i) * 4;

      let sx = this.x + cos(angle) * r;
      let sy = this.y + sin(angle) * r;

      fill(200, 220, 255, 180);
      ellipse(sx, sy, 3);
    }

    // soft atmospheric edges
    noStroke();

    for (let i = 0; i < 150; i++) {
      let alpha = map(i, 0, 150, 0, 60);

      fill(230, 240, 255, alpha);

      ellipse(-50, height / 2, 200 + i * 2, height + 200);
      ellipse(width + 50, height / 2, 200 + i * 2, height + 200);

      ellipse(width / 2, -50, width + 200, 200 + i * 2);
      ellipse(width / 2, height + 50, width + 200, 200 + i * 2);
    }
  }
}
