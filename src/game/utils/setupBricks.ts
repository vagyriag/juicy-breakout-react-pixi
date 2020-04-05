import { Application, Container } from "pixi.js";
import { Brick } from "../objects/Brick";
import { enableObjectIntro } from "./enableObjectIntro";
import { Vector } from "./Vector";

export const setupBricks = (app: Application, bricks: Container, color: number, groupW: number, groupH: number, numX: number, numY: number, padding: number) => {
  const bricksW = (groupW - padding * (numX - 1)) / numX;
  const bricksH = (groupH - padding * (numY - 1)) / numY;

  Brick.createTexture(app, color, bricksW, bricksH);
  Array
    .from({ length: numX * numY })
    .forEach((_, index: number) => {
      const y = Math.floor(index / numX);
      const x = index - y * numX;
      const brick = new Brick(x * (bricksW + padding), y * (bricksH + padding));
      if(index > 0) return;
      setTimeout(() => {
        const transition = enableObjectIntro(brick, 
          {
            pos: new Vector(brick.position.x, -200),
          }, {
            pos: new Vector(brick.position),
          }, 
          400 + Math.random() * 200
        );
        transition.start();
        bricks.addChild(brick);
      }, Math.random() * 300)
    });

  return bricks;
}