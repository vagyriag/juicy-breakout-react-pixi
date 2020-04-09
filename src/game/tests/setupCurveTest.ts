import { Application, Container, Ticker } from "pixi.js";
import { Ball } from "../objects/Ball";
import { setupSides } from "../utils/setupSides";
import { Vector } from "../utils/Vector";
import { isTouching } from "../isTouching";
import { Side } from "../objects/Side";

export const setupCurveTest = (app: Application) => {
  const { width, height } = app.view;

  const sides = new Container();
  app.stage.addChild(sides);
  setupSides(app, sides, 100, 0x11cccc);

  sides.addChild(new Side(0x11cccc, width * .3, height * .3, width * .4, height * .4));

  Ball.createTexture(app, 0xffff00, 0xffffff, 20);
  const ball = new Ball();
  ball.position.set(width * .5, height * .8);
  ball.vel = new Vector(10, 10);
  ball.inStage = true;
  app.stage.addChild(ball);

  const process = () => {
    ball.move();

    sides.children.forEach(side => {
      const touch = isTouching(side, ball, 1);
      if(touch) {
        ball.bounce(touch, side);
        if(side instanceof Side) side.curveByTouch(touch, new Vector(ball));
      }
    });
  }

  const ticker = new Ticker();
  ticker.add(process);
  ticker.start();
}