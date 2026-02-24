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
    fill(50, 110, 255);
    noStroke();
    let pulse = sin(frameCount * 0.05) * 2;
    rect(
      this.x - 12 - pulse,
      this.y - 12 - pulse,
      24 + pulse * 2,
      24 + pulse * 2,
      6,
    );
  }
}
