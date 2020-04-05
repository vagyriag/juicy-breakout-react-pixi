import { Brick } from "../objects/Brick";
import { Application, Graphics, TextStyle, Text, interaction, Sprite } from "pixi.js";
import { Ball } from "../objects/Ball";
import { Vector } from "./Vector";
import { pI } from "./pI";

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

    const vectorA = Vector.fromBox(boxA);
    const vectorB = Vector.fromBox(boxB);
    const angle = Vector.sub(vectorB, vectorA).heading();

    const leftTop = new Vector(boxA.x - boxB.width * .5, boxA.y - boxB.height * .5);
    const rightTop = new Vector(boxA.x + boxA.width + boxB.width * .5, boxA.y - boxB.height * .5);

    const leftBottom = new Vector(boxA.x - boxB.width * .5, boxA.y + boxA.height + boxB.height * .5);
    const rightBottom = new Vector(boxA.x + boxA.width + boxB.width * .5, boxA.y + boxA.height + boxB.height * .5);
    
    const leftTopAng = Vector.sub(leftTop, vectorA).heading();
    const rightTopAng = Vector.sub(rightTop, vectorA).heading();
    const leftBottomAng = leftTopAng * -1;
    const rightBottomAng = rightTopAng * -1;

    let side = '';
    if(angle >= leftTopAng && angle < rightTopAng) side = 'top';
    if(angle >= rightTopAng && angle < rightBottomAng) side = 'right';
    if(angle >= rightBottomAng && angle < leftBottomAng) side = 'bottom';
    if(angle >= leftBottomAng || angle < leftTopAng) side = 'left';

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