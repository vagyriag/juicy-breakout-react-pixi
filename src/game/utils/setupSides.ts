import { Container, Application } from "pixi.js";
import { Side } from "../objects/Side";

export const setupSides = (app: Application, sides: Container, size: number, color: number) => {
  const { width, height } = app.view;
  const top = new Side(color, -size, -size, width + size, size);
  const right = new Side(color, width, -size, size, height + size);
  const bottom = new Side(color, -size, height, width + size, size);
  const left = new Side(color, -size, -size, size, height + size);
  sides.addChild(top);
  sides.addChild(right);
  sides.addChild(bottom);
  sides.addChild(left);
}