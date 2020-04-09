import { DisplayObject, Graphics, Application } from "pixi.js";
import { getBoxVertices, getBoxVerticesReturnType } from "./getBoxVertices";
import { fractureBox } from "./fractureBox";
import { Vector } from "./Vector";
import { interpolateLine } from "./interpolateLine";
import { Ease } from "./Ease";
import { isTouchingReturnType } from "../isTouching";

export const breakBrick = (app: Application, touch: isTouchingReturnType, objA: DisplayObject, objB: DisplayObject) => {
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

const getPointsByTouch = (touch: isTouchingReturnType, vert: getBoxVerticesReturnType) => {
  const rA = Math.random() * .4 + .3;
  const rB = Math.random() * .4 + .3;

  if(touch.top) return [ vert.lt.lerp(vert.rt, rA), vert.lb.lerp(vert.rb, rB) ];
  if(touch.right) return [ vert.rt.lerp(vert.rb, rA), vert.lt.lerp(vert.lb, rB) ];
  if(touch.bottom) return [ vert.lb.lerp(vert.rb, rA), vert.lt.lerp(vert.rt, rB) ];
  return [ vert.lt.lerp(vert.lb, rA), vert.rt.lerp(vert.rb, rB) ];
}