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
    const wH = Paddle.tx.width * .5;
    const hH = Paddle.tx.height * .5;
    this.pivot.set(wH, hH);
  }

  move (x: number) {
    this.x = x;
  }

  addBall (ball: Ball) {
    this.addChild(ball);
    ball.position.set(Paddle.tx.width * .5, Ball.tx.height * -.5);
  }
}