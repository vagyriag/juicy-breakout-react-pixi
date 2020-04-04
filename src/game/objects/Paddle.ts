import { Container, Application, Graphics, Sprite } from 'pixi.js';
import { Ball } from './Ball';

export class Paddle extends Container {

  constructor (app: Application, color: number, width: number, height: number) {
    super();

    const gr = new Graphics();
    gr.beginFill(color)
      .drawRect(0, 0, width, height)
      .endFill();

    const texture = app.renderer.generateTexture(gr, 1, 1);

    this.addChild(new Sprite(texture));

    this.pivot.set(width * .5, height * .5);
    this.position.set(app.view.width * .5, app.view.height - height * 2);
  }

  move (x: number) {
    this.x = x;
  }

  positionBall (ball: Ball) {
    ball.position.set(this.x, this.y - 20);
  }
}