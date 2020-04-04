import { Sprite, Graphics, Application, Texture } from "pixi.js";

export class Ball extends Sprite {

  static tx: Texture;

  static createTexture (app: Application, color: number, size: number) {
    const gr = new Graphics();
    gr.beginFill(color)
      .drawCircle(0, 0, size)
      .endFill();
    this.tx = app.renderer.generateTexture(gr, 1, 1);
  }

  constructor (x: number, y: number) {
    super(Ball.tx);
    const wH = Ball.tx.width * .5;
    const hH = Ball.tx.height * .5;
    this.pivot.set(wH, hH);
    this.position.set(x + wH, y + hH);
  }
}