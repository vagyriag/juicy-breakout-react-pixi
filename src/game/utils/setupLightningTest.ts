import { Brick } from "../objects/Brick";
import { Application, Graphics, interaction } from "pixi.js";
import { Ball } from "../objects/Ball";
import { Vector } from "./Vector";
import { getBoxParts } from "./getBoxParts";
import { isTouching, isTouchingReturnType } from "../isTouching";
import { getBoxVertices, getBoxVerticesReturnType } from "./getBoxVertices";

export const setupLightningTest = (app: Application) => {
  const { width, height } = app.view;
  
  Brick.createTexture(app, 0xcc11cc, 200, 50);
  const objA = new Brick(width * .5, height * .5);
  app.stage.addChild(objA);

  Ball.createTexture(app, 0xccf111, 0xccf111, 20);
  const objB = new Ball();
  app.stage.addChild(objB);

  app.stage.interactive = true;
  const gr = new Graphics();
  app.stage.addChild(gr);

  const info = document.createElement('pre');
  info.style.position = 'fixed';
  info.style.top = '0px';
  info.style.left = '0px';
  info.style.color = 'white';
  info.style.margin = '0px';
  info.style.padding = '20px';
  document.body.appendChild(info);

  const process = (ev: interaction.InteractionEvent) => {
    objB.position.copyFrom(ev.data.global);

    const touch = isTouching(objA, objB);
    const side = touch && Object.keys(touch).find((k) => (touch as any)[k]);
    info.innerText = side || '';

    if(!touch) return;

    gr.clear();
    
    const bounds = objA.getBounds();
    const vertices = getBoxVertices(bounds);
    
    const [ pointA, pointB ] = getPointsByTouch(touch, vertices);
    const points = getBoxParts(vertices, pointA, pointB);
    
    if(points){
      gr.lineStyle(2, 0xff0000);
      points.fracture.forEach((pt, i) => {
          gr[i === 0 ? 'moveTo' : 'lineTo'](pt.x, pt.y);
      });
    }
  }

  app.stage.on('mousemove', process);
}


const getPointsByTouch = (touch: isTouchingReturnType, vert: getBoxVerticesReturnType) => {
  const rA = Math.random() * .4 + .3;
  const rB = Math.random() * .4 + .3;

  if(touch.top) return [ vert.lt.lerp(vert.rt, rA), vert.lb.lerp(vert.rb, rB) ];
  if(touch.right) return [ vert.rt.lerp(vert.rb, rA), vert.lt.lerp(vert.lb, rB) ];
  if(touch.bottom) return [ vert.lb.lerp(vert.rb, rA), vert.lt.lerp(vert.rt, rB) ];
  return [ vert.lt.lerp(vert.lb, rA), vert.rt.lerp(vert.rb, rB) ];
}