import { Application } from "pixi.js";
import { Ball } from "../objects/Ball";
import { setTransition } from "./setTransition";
import { Vector } from "./Vector";

export const setupTransitionTest = (app: Application) => {
  const { width, height } = app.view;

  Ball.createTexture(app, 0xccf111, 20);
  const ball = new Ball();
  ball.position.set(width * .5, height * .5);
  app.stage.addChild(ball);

  const duration = 1000;
  const transition = () => {
    setTransition(ball, {
      frames: [
        {
          scale: new Vector(0, 0),
        },
        {
          time: .2,
          scale: new Vector(2, 1),
        },
        {
          time: .5,
          scale: new Vector(3, 3),
        },
        {
          scale: new Vector(1, 1),
        }
      ],
      duration: duration,
      autoStart: true,
    });
  };
  transition();
  setInterval(transition, duration + 500);

}