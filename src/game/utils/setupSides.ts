import { Container, Graphics, Application } from "pixi.js";

export const setupSides = (app: Application, sides: Container, size: number, color: number) => {
  const { width, height } = app.view;
  var top = new Graphics()
    .beginFill(color)
    .drawRect(-size, -size, width + size, size)
    .endFill();
  var right = new Graphics()
    .beginFill(color)
    .drawRect(width, -size, size, height + size)
    .endFill();
  var bottom = new Graphics()
    .beginFill(color)
    .drawRect(-size, height, width + size, size)
    .endFill();
  var left = new Graphics()
    .beginFill(color)
    .drawRect(-size, -size, size, height + size)
    .endFill();
  sides.addChild(top);
  sides.addChild(right);
  sides.addChild(bottom);
  sides.addChild(left);
}