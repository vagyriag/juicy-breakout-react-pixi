import { Application } from "pixi.js";
import { Ball } from "../objects/Ball";
import { setTransition } from "./setTransition";
import { Vector } from "./Vector";
import { Ease } from "./Ease";

export const setupTransitionTest = (app: Application) => {
  const { width, height } = app.view;

  Ball.createTexture(app, 0xccf111, 20);
  const ball = new Ball();
  ball.position.set(width * .5, height * .5);
  app.stage.addChild(ball);

  const duration = 800;
  const initialScale = new Vector(1, 1.5);
  const transition = () => {
    console.clear();
    setTransition(ball, {
      frames: [
        {
          scale: initialScale,
        },
        {
          scale: new Vector(1.4, .7),
        },
        {
          scale: new Vector(1, 1.3),
        },
        {
          scale: new Vector(1.2, .8),
        },
        {
          scale: new Vector(1, 1),
        },
      ],
      duration: duration,
      autoStart: true,
      easingFunction: Ease.inOut(1.5),
    });
  };
  transition();
  setInterval(transition, duration + 500);
}