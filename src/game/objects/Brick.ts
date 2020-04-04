import { Sprite, Texture, Graphics, Application } from "pixi.js";

export class Brick extends Sprite {

  static tx: Texture;

  static createTexture (app: Application, color: number, width: number, height: number) {
    const gr = new Graphics();
    gr.beginFill(color)
      .drawRect(0, 0, width, height)
      .endFill();
console.log('x')
    this.tx = app.renderer.generateTexture(gr, 1, 1);
  }

  constructor (x: number, y: number) {
    super(Brick.tx);
    //this.pivot.set(Brick.tx.width * .5, Brick.tx.height * .5);
    this.position.set(x, y);
  }
  
}