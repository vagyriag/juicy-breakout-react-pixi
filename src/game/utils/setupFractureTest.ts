import { Brick } from "../objects/Brick";
import { Application, Graphics, interaction } from "pixi.js";
import { Ball } from "../objects/Ball";
import { isTouching } from "../isTouching";
import { Vector } from "./Vector";

export const setupFractureTest = (app: Application) => {
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

  const setDirection = (ev: interaction.InteractionEvent) => {
    objB.vel = Vector.random2D();
    objB.vel.setMag(200);
    process(ev);
  }

  const process = (ev: interaction.InteractionEvent) => {
    objB.position.copyFrom(ev.data.global);

    gr.clear();

    gr.beginFill(0x000)
      .drawCircle(objB.x, objB.y, 4)
      .endFill();

    const line = new Vector(new Vector(objB).add(objB.vel));
    gr.lineStyle(2, 0xff0000)
      .moveTo(objB.x, objB.y)
      .lineTo(line.x, line.y);
    
    
    const bounds = objA.getBounds();
    const lt = new Vector(bounds);
    const rt = new Vector(new Vector(bounds).add(bounds.width, 0));
    const lb = new Vector(new Vector(bounds).add(0, bounds.height));
    const rb = new Vector(new Vector(bounds).add(bounds.width, bounds.height));

    const sides = [
      [lt, rt], [rt, rb], [rb, lb], [lb, lt]
    ]
    
    sides.forEach(([a, b]) => {
      const pt = intersection(new Vector(objB), line, a, b);
      if(pt) {
        gr.beginFill(0xff0000)
          .drawCircle(pt.x, pt.y, 4)
          .endFill();
      }
    });
  }

  app.stage.on('click', setDirection);
  app.stage.on('mousemove', process);
  setDirection({ data: { global: { x: 0, y: 0 } } } as any);
}

const DIV_TOO_FAR = 0.00001;
const intersection = (a: Vector, b: Vector, c: Vector, d: Vector): Vector|false => {
  // center everything on point "d"
  const axis = c.copy().sub(d);
  const axLen = axis.mag();
  axis.normalize();
  const workingA = a.copy().sub(d);
  const workingB = b.copy().sub(d);

  // create a perpendicular vector to "c-d"
  const rightang = new Vector(-axis.y, axis.x);

  // In short: rotate everything so "c-d" becomes the y-axis
  //   rightang becomes x-axis
  const mappedA = new Vector(workingA.dot(rightang), workingA.dot(axis));
  const mappedB = new Vector(workingB.dot(rightang), workingB.dot(axis));
  // More detail: mappedA and -B are projections of "a" and "b" onto the lines
  //   "c-d" and "rightang", creating Axis Aligned 2D coordinates

  // Get the axis-aligned segment
  const dir = mappedA.sub(mappedB);

  // This is the same math used for 2D axis-aligned-bounding-boxes but only used
  //   for one intersection instead of two edges
  // In other words:
  //   "How much do we change segment 'a-b's length to reach segment 'c-d'?"
  // Result can be +/- INF, meaning segments are parallel
  // Relying on the floating point to handle div by 0.0 --> INF
  //   is implementation dependant. Your hardware may vary.
  let tx = 1.0 / DIV_TOO_FAR;
  if (Math.abs(dir.x) > DIV_TOO_FAR)
    tx = -mappedB.x / dir.x;
  
  // when the original line segment "a-b" is extended/shortened by tx,
  //   the end of that segment is the intersecting point
  const inters = new Vector(a.copy().sub(b).mult(tx).add(b));
  
  // Segment/segment intersection:
  // Logic is that if the first segment would have to expand or reverse to
  //   reach the point at 'inters', then the segments do not cross
  const ty = inters.sub(d).dot(axis);
  const intersecting = (tx >= 0) && (tx <= 1.0) && (ty >= 0) && (ty <= axLen);
  
  inters.add(d);
  return intersecting ? inters : false;
}