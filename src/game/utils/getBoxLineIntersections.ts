import { Rectangle } from "pixi.js";
import { Vector } from "./Vector";
import { getLinesIntersection } from "./getLinesIntersection";

export const getBoxLineIntersections = (box: Rectangle, pointA: Vector, pointB: Vector): Vector[] => {
  const lt = new Vector(box);
  const rt = new Vector(box).add(box.width, 0);
  const lb = new Vector(box).add(0, box.height);
  const rb = new Vector(box).add(box.width, box.height);

  const sides = [ [lt, rt], [rt, rb], [rb, lb], [lb, lt] ];

  const points: Vector[] = [];
  sides.forEach(([a, b]) => {
    const pt = getLinesIntersection(pointA, pointB, a, b);
    if(pt) points.push(pt);
  });

  return points;
}