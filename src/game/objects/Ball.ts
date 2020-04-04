import { Sprite, Graphics, Application, Texture } from "pixi.js";
import Victor from "victor";

export class Ball extends Sprite {

  static tx: Texture;

  inStage: boolean;
  vel: Victor;

  static createTexture (app: Application, color: number, size: number) {
    const gr = new Graphics();
    gr.beginFill(color)
      .drawCircle(0, 0, size)
      .endFill();
    this.tx = app.renderer.generateTexture(gr, 1, 1);
  }

  constructor () {
    super(Ball.tx);
    const wH = Ball.tx.width * .5;
    const hH = Ball.tx.height * .5;
    this.pivot.set(wH, hH);
    this.inStage = false;
    this.vel = new Victor(0, 0);
  }

  release () {
    this.inStage = true;
    this.vel.y = -10;
    const maxR = Math.PI * .5;
    const r = Math.random() * maxR - maxR * .5;
    this.vel.rotate(r);
  }

  process () {
    if(!this.inStage) return;
    this.position.set(...Victor.fromObject(this.position).add(this.vel).toArray());
  }
}