import { Application, Graphics, Sprite, Texture } from 'pixi.js';
import { Ball } from './Ball';
import { pI } from '../utils/pI';
import { settings } from '../utils/settings';

export class Paddle extends Sprite {

  static tx: Texture;

  static createTexture(app: Application, color: number, width: number, height: number) {
    const gr = new Graphics();
    gr.beginFill(color)
      .drawRect(0, 0, width, height)
      .endFill();
    this.tx = app.renderer.generateTexture(gr, 1, 1);
  }

  constructor() {
    super(Paddle.tx);
    const box = this.getBounds();
    const wH = box.width * .5;
    const hH = box.height * .5;
    this.pivot.set(wH, hH);
  }

  move(x: number) {
    if(settings.paddle.squishy){
      const mov = Math.abs(this.x - x);
      const max = 60;
      this.scale.x = pI.map(mov, 0, max, 1, 1.6, true);
      this.scale.y = pI.map(mov, 0, max, 1, 0.6, true);
    }
    this.x = x;
  }

  process() {
    this.scale.set(1, 1);
  }

  addBall(ball: Ball) {
    ball.position.set(this.getBounds().width * .5, ball.getBounds().height * -.5);
    this.addChild(ball);
  }
}