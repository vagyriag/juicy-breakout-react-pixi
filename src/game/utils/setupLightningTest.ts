import { Brick } from "../objects/Brick";
import { Application, Graphics, interaction } from "pixi.js";
import { Ball } from "../objects/Ball";
import { fractureBox } from "./fractureBox";
import { isTouching, isTouchingReturnType } from "../isTouching";
import { getBoxVertices, getBoxVerticesReturnType } from "./getBoxVertices";
import { Vector } from "./Vector";
import { interpolateLine } from "./interpolateLine";
import { Ease } from "./Ease";

export const setupLightningTest = (app: Application) => {
  const { width, height } = app.view;
  
  Brick.createTexture(app, 0xcc11cc, 200, 50);
  const objA = new Brick(width * .5, height * .5);
  app.stage.addChild(objA);

  Ball.createTexture(app, 0xccf111, 0xccf111, 3);
  const objB = new Ball();
  app.stage.addChild(objB);

  app.stage.interactive = true;

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
    
    const bounds = objA.getBounds();
    const vertices = getBoxVertices(bounds);
    
    const [ pointA, pointB ] = getPointsByTouch(touch, vertices);
    const points = fractureBox(vertices, pointA, pointB);
    
    if(points){
      const extra = Vector.sub(pointB, pointA).mult(.7).add(pointB);
      const lightning = [ ...points.fracture, extra ];

      const gr = new Graphics();
      interpolateLine(gr, {
        vectors: lightning,
        duration: 200,
        easingFunction: Ease.in(2),
        onFinish: () => 
          setTimeout(() => {
            app.stage.removeChild(gr);
            gr.destroy();
          }, 40)
      });
      app.stage.addChild(gr);
    }
  }

  app.stage.on('click', process);
}


const getPointsByTouch = (touch: isTouchingReturnType, vert: getBoxVerticesReturnType) => {
  const rA = Math.random() * .4 + .3;
  const rB = Math.random() * .4 + .3;

  if(touch.top) return [ vert.lt.lerp(vert.rt, rA), vert.lb.lerp(vert.rb, rB) ];
  if(touch.right) return [ vert.rt.lerp(vert.rb, rA), vert.lt.lerp(vert.lb, rB) ];
  if(touch.bottom) return [ vert.lb.lerp(vert.rb, rA), vert.lt.lerp(vert.rt, rB) ];
  return [ vert.lt.lerp(vert.lb, rA), vert.rt.lerp(vert.rb, rB) ];
}