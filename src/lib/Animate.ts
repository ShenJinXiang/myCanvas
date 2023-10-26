import BaseCanvas from "./BaseCanvas";

export default class Animate extends BaseCanvas {

  private fps: number = 0;
  private fpsInterval: number = 0;
  private last: number = 0;

  constructor() {
    super();
    this.fps = 75;
    this.fpsInterval = 1000 / this.fps;
    this.last = new Date().getTime();
  }

  animate(): void {
    this.update();
    // requestAnimationFrame(this.run.bind(this));
  }
  update(): void { }
  draw(): void { }

  run() {
    const now = new Date().getTime();
    const elapsed = now - this.last;
    if (elapsed >= this.fpsInterval) {
      this.last = now - (elapsed % this.fpsInterval);
      this.animate();
    }
    this.draw();
    this.drawMark();
    requestAnimationFrame(this.run.bind(this));
  }

}