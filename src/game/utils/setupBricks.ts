import { Application, Container } from "pixi.js";
import { Brick } from "../objects/Brick";
import { setTransition } from "./setTransition";
import { Vector } from "./Vector";
import Bezier from 'bezier-easing';
import { settings } from "./settings";

export const setupBricks = (app: Application, bricks: Container, color: number, groupW: number, groupH: number, numX: number, numY: number, padding: number) => {
  const bricksW = (groupW - padding * (numX - 1)) / numX;
  const bricksH = (groupH - padding * (numY - 1)) / numY;

  const easing = Bezier(.48,1.52,.34,.87);

  Brick.createTexture(app, color, bricksW, bricksH);
  Array
    .from({ length: numX * numY })
    .forEach((_, index: number) => {
      const y = Math.floor(index / numX);
      const x = index - y * numX;
      const brick = new Brick(x * (bricksW + padding), y * (bricksH + padding));
      bricks.addChild(brick);
      if(!settings.brick.transition) return;
      setTransition(brick, {
        enter: {
          position: new Vector(brick.position).add(Vector.random2D().mult(100)),
          scale: new Vector(0.4, 0.4),
          alpha: 0,
          rotation: Math.random() * Math.PI * .2 - Math.PI * .1,
        },
        exit: {
          position: new Vector(brick.position),
          scale: new Vector(1, 1),
          alpha: 1,
          rotation: 0,
        },
        duration: 600 + Math.random() * 200,
        delay: Math.random() * 700,
        easingFunction: easing,
      });
    });

  return bricks;
}