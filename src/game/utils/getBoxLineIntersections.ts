import { Rectangle } from "pixi.js";
import { Vector } from "./Vector";
import { getLinesIntersection } from "./getLinesIntersection";
import { getBoxVertices, getBoxVerticesReturnType } from "./getBoxVertices";

export const getBoxLineIntersections = (box: Rectangle|getBoxVerticesReturnType, pointA: Vector, pointB: Vector): Vector[] => {
  const { lt, rt, rb, lb } = box instanceof Rectangle ? getBoxVertices(box) : box;
  const sides = [ [lt, rt], [rt, rb], [rb, lb], [lb, lt] ];

  const points: Vector[] = [];
  sides.forEach(([a, b]) => {
    const pt = getLinesIntersection(pointA, pointB, a, b);
    if(pt) points.push(pt);
  });

  return points;
}