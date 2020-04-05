import { Sprite, Texture, Graphics, Application } from "pixi.js";

export class Brick extends Sprite {

  static tx: Texture;

  static createTexture(app: Application, color: number, width: number, height: number) {
    const gr = new Graphics();
    gr.beginFill(color)
      .drawRect(0, 0, width, height)
      .endFill();
    this.tx = app.renderer.generateTexture(gr, 1, 1);
  }

  constructor(x: number, y: number) {
    super(Brick.tx);
    const box = this.getBounds();
    const wH = box.width * .5;
    const hH = box.height * .5;
    this.pivot.set(wH, hH);
    this.position.set(x + wH, y + hH);
  }
  
}