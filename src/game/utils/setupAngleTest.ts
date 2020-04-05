import { Brick } from "../objects/Brick";
import { Application, Graphics, TextStyle, Text, interaction } from "pixi.js";
import { Ball } from "../objects/Ball";
import { Vector } from "./Vector";
import { pI } from "./pI";
import { getTouchingSidesInfo } from "../isTouching";

export const setupAngleTest = (app: Application) => {
  const { width, height } = app.view;
  
  Brick.createTexture(app, 0xcc11cc, 200, 20);
  const objA = new Brick(width * .5, height * .5);
  app.stage.addChild(objA);

  Ball.createTexture(app, 0xccf111, 20);
  const objB = new Ball();
  app.stage.addChild(objB);

  app.stage.interactive = true;
  const gr = new Graphics();
  const style = new TextStyle({
    fontSize: 14,
    fill: '#ffffff',
  });
  app.stage.addChild(gr);
  
  app.stage.on('mousemove', (ev: interaction.InteractionEvent) => {
    objB.position.copyFrom(ev.data.global);

    const boxA = objA.getBounds();
    const boxB = objB.getBounds();

    const { angle, leftTopAng, rightTopAng, leftBottomAng, rightBottomAng, vectorA, sides } = getTouchingSidesInfo(boxA, boxB, 1);

    const size = 200;
    const leftTop = Vector.fromAngle(leftTopAng).mult(size).add(vectorA);
    const rightTop = Vector.fromAngle(rightTopAng).mult(size).add(vectorA);
    const leftBottom = Vector.fromAngle(leftBottomAng).mult(size).add(vectorA);
    const rightBottom = Vector.fromAngle(rightBottomAng).mult(size).add(vectorA);

    // @ts-ignore
    let side = Object.keys(sides).find(k => sides[k]);

    gr.removeChildren();
    gr.clear()
      .lineStyle(2, 0xffffff)
      .moveTo(objA.getGlobalPosition().x, objA.getGlobalPosition().y)
      .lineTo(objB.x, objB.y)
      .moveTo(leftTop.x, leftTop.y)
      .lineTo(objA.getGlobalPosition().x, objA.getGlobalPosition().y)
      .moveTo(rightTop.x, rightTop.y)
      .lineTo(objA.getGlobalPosition().x, objA.getGlobalPosition().y)
      .moveTo(leftBottom.x, leftBottom.y)
      .lineTo(objA.getGlobalPosition().x, objA.getGlobalPosition().y)
      .moveTo(rightBottom.x, rightBottom.y)
      .lineTo(objA.getGlobalPosition().x, objA.getGlobalPosition().y);

    const tx = new Text(Math.round(pI.degrees(angle)) + ' ' + side, style);
    tx.position.x = objB.position.x + 15;
    tx.position.y = objB.position.y + 15;
    gr.addChild(tx);


  });
}