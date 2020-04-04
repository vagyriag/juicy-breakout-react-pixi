import { Application, Graphics, Sprite, Texture, DisplayObject } from 'pixi.js';
import { Ball } from './Ball';

export class Paddle extends Sprite {

  static tx: Texture;

  static createTexture (app: Application, color: number, width: number, height: number) {
    const gr = new Graphics();
    gr.beginFill(color)
      .drawRect(0, 0, width, height)
      .endFill();
    this.tx = app.renderer.generateTexture(gr, 1, 1);
  }

  constructor () {
    super(Paddle.tx);
    const box = this.getBounds();
    const wH = box.width * .5;
    const hH = box.height * .5;
    this.pivot.set(wH, hH);
  }

  move (x: number) {
    this.x = x;
  }

  addBall (ball: Ball) {
    ball.position.set(this.getBounds().width * .5, ball.getBounds().height * -.5);
    this.addChild(ball);
  }
}