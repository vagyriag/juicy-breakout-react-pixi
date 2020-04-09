import { DisplayObject, Graphics, Application } from "pixi.js";
import { getBoxVertices, getBoxVerticesReturnType } from "./getBoxVertices";
import { Vector } from "./Vector";
import { interpolateLine } from "./interpolateLine";
import { Ease } from "./Ease";
import { isTouchingReturnType } from "../isTouching";
import { setTransition } from "./setTransition";
import { settings } from "./settings";

export const breakBrick = (app: Application, touch: isTouchingReturnType, objA: DisplayObject, objB: DisplayObject) => {
  const bounds = objA.getBounds();
  const vertices = getBoxVertices(bounds);
  
  const [ pointA, pointB ] = getPointsByTouch(touch, vertices);
  const newPoints = [
    new Vector(pointA).lerp(pointB, .33),
    new Vector(pointA).lerp(pointB, .66),
  ];

  newPoints.forEach((point) => {
    point.add(Vector.random2D().mult(bounds.height * .3));
  });
  const fracture = [ pointA, ...newPoints, pointB ];
  
  const sideA = fracture.slice();
  const sideB = fracture.slice();

  const fromLR = touch.left || touch.right;
  const fromTB = touch.top || touch.bottom;

  if(touch.bottom || touch.right) {
    sideA.reverse();
    sideB.reverse();
  }

  if(fromTB){
    sideA.push(vertices.rb, vertices.rt);
    sideB.push(vertices.lb, vertices.lt);
  }

  if(fromLR){
    sideA.push(vertices.rt, vertices.lt);
    sideB.push(vertices.rb, vertices.lb);
  }

  const movBg = 100;
  const movSm = 40;

  // sideA (top or right)
  const grA = new Graphics();
  const globalA = new Vector(objA.getGlobalPosition());
  grA.beginFill(0xcc11cc);
  sideA.forEach((pt, i) => {
    pt = new Vector(pt).sub(globalA);
    grA[i === 0 ? 'moveTo' : 'lineTo'](pt.x, pt.y);
  });
  grA.closePath();
  grA.endFill();
  const rA = Math.random() - .5;
  grA.position.copyFrom(globalA);
  setTransition(grA, {
    frames: [
      {
        position: new Vector(grA),
        rotation: 0,
      },
      {
        position: new Vector(grA).add(fromLR ? new Vector(rA * movSm, movBg * -1) : new Vector(movBg, rA * movSm)),
        rotation: rA,
      }
    ],
    duration: 300,
    delay: 200,
    easingFunction: Ease.inOut(2),
    onFinish: () => {
      app.stage.removeChild(grA);
      grA.destroy();
    }
  });

  // sideB (bottom or left)
  const grB = new Graphics();
  const globalB = new Vector(objA.getGlobalPosition());
  grB.beginFill(0xcc11cc);
  sideB.forEach((pt, i) => {
    pt = new Vector(pt).sub(globalB);
    grB[i === 0 ? 'moveTo' : 'lineTo'](pt.x, pt.y);
  });
  grB.closePath();
  grB.endFill();
  const rB = Math.random() - .5;
  grB.position.copyFrom(globalA);
  setTransition(grB, {
    frames: [
      {
        position: new Vector(grB),
        rotation: 0,
      },
      {
        position: new Vector(grB).add(fromLR ? new Vector(rB * movSm, movBg * 1) : new Vector(movBg * -1, rB * movSm)),
        rotation: rB,
      }
    ],
    duration: 300,
    delay: 200,
    easingFunction: Ease.inOut(2),
    onFinish: () => {
      app.stage.removeChild(grB);
      grB.destroy();
    }
  });

  // lightning
  const extra = Vector.sub(pointB, pointA).mult(.7).add(pointB);
  const lightning = [ ...fracture, extra ];
  const gr = new Graphics();
  interpolateLine(gr, {
    vectors: lightning,
    enter: {
      duration: 200,
      easingFunction: Ease.inOut(2),
    },
    exit: {
      duration: 200,
      delay: -50,
      easingFunction: Ease.inOut(2),
    },
    onFinish: () => 
      setTimeout(() => {
        app.stage.removeChild(gr);
        gr.destroy();
      }, 40),
    line: {
      width: 2,
      color: 0xffff00,
    }
  });

  if(settings.brick.break){
    app.stage.addChild(grB);
    app.stage.addChild(grA);
  }
  if(settings.brick.lightning) app.stage.addChild(gr);
}

const getPointsByTouch = (touch: isTouchingReturnType, vert: getBoxVerticesReturnType) => {
  const rA = Math.random() * .4 + .3;
  const rB = Math.random() * .4 + .3;

  const lt = vert.lt.copy();
  const rt = vert.rt.copy();
  const lb = vert.lb.copy();
  const rb = vert.rb.copy();

  if(touch.top) return [ lt.lerp(rt, rA), lb.lerp(rb, rB) ];
  if(touch.bottom) return [ lb.lerp(rb, rA), lt.lerp(rt, rB) ];
  if(touch.right) return [ rt.lerp(rb, rA), lt.lerp(lb, rB) ];
  return [ lt.lerp(lb, rA), rt.lerp(rb, rB) ];
}