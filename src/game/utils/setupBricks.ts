import { Application, Container } from "pixi.js";
import { Brick } from "../objects/Brick";

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
      bricks.addChild(brick);
    });

  return bricks;
}