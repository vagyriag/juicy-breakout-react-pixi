import { Container, Graphics, Application } from "pixi.js";

export const setupSides = (app: Application, sides: Container, sideSize: number, sideColor: number) => {
  const { width, height } = app.view;
  var top = new Graphics()
    .beginFill(sideColor)
    .drawRect(0, -sideSize, width, sideSize)
    .endFill();
  var right = new Graphics()
    .beginFill(sideColor)
    .drawRect(width, 0, sideSize, height)
    .endFill();
  var bottom = new Graphics()
    .beginFill(sideColor)
    .drawRect(0, height, width, sideSize)
    .endFill();
  var left = new Graphics()
    .beginFill(sideColor)
    .drawRect(-sideSize, 0, sideSize, height)
    .endFill();
  sides.addChild(top);
  sides.addChild(right);
  sides.addChild(bottom);
  sides.addChild(left);
}