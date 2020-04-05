import { Brick } from "../objects/Brick";
import { Application, Graphics, TextStyle, Text, interaction } from "pixi.js";
import { Ball } from "../objects/Ball";
import { Vector } from "./Vector";
import { pI } from "./pI";

export const setupTest = (app: Application) => {
  const { width, height } = app.view;
  Brick.createTexture(app, 0xcc11cc, 200, 20);
  const brick = new Brick(width * .5, height * .5);
  app.stage.addChild(brick);
  Ball.createTexture(app, 0xccf111, 20);
  const ball = new Ball();
  app.stage.addChild(ball);
  app.stage.interactive = true;
  const gr = new Graphics();
  const style = new TextStyle({
    fontSize: 14,
    fill: '#ffffff',
  });
  app.stage.addChild(gr);
  
  app.stage.on('mousemove', (ev: interaction.InteractionEvent) => {
    ball.position.copyFrom(ev.data.global);

    const objA = brick;
    const objB = ball;
    const boxA = objA.getBounds();
    const boxB = objB.getBounds();

    const va = new Vector(objA.getGlobalPosition());
    const vb = new Vector(objB.getGlobalPosition());
    const ang = Vector.sub(vb, va).heading();

    const leftTop = new Vector(boxA.x - boxB.width * .5, boxA.y - boxB.height * .5);
    const rightTop = new Vector(boxA.x + boxA.width + boxB.width * .5, boxA.y - boxB.height * .5);

    const leftBottom = new Vector(boxA.x - boxB.width * .5, boxA.y + boxA.height + boxB.height * .5);
    const rightBottom = new Vector(boxA.x + boxA.width + boxB.width * .5, boxA.y + boxA.height + boxB.height * .5);
    
    const leftTopAng = Vector.sub(leftTop, va).heading();
    const rightTopAng = Vector.sub(rightTop, va).heading();
    const leftBottomAng = leftTopAng * -1;
    const rightBottomAng = rightTopAng * -1;

    let side = '';

    if(ang >= leftTopAng && ang < rightTopAng) side = 'top';
    if(ang >= rightTopAng && ang < rightBottomAng) side = 'right';
    if(ang >= rightBottomAng && ang < leftBottomAng) side = 'bottom';
    if(ang >= leftBottomAng || ang < leftTopAng) side = 'left';

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

    const tx = new Text(Math.round(pI.degrees(ang)) + ' ' + side, style);
    tx.position.x = ball.position.x + 15;
    tx.position.y = ball.position.y + 15;
    gr.addChild(tx);


  });
}