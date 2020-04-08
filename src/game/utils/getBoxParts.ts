import { Rectangle } from "pixi.js";
import { getBoxVertices } from "./getBoxVertices";
import { getBoxLineIntersections } from "./getBoxLineIntersections";
import { divideLineInPoints } from "./divideLineInPoints";
import { Vector } from "./Vector";

export const getBoxParts = (box: Rectangle, pointA: Vector, pointB: Vector) => {
  const vertices = getBoxVertices(box);
  const points = getBoxLineIntersections(vertices, pointA, pointB);
  if(points.length < 2) return false;
  const [ a, b ] = points;
  const [ newPoints, part ] = divideLineInPoints(a, b, 2);
  newPoints.forEach((point) => {
    point.add(Vector.random2D().mult(part * .45));
  })
  return {
    left: [ a, ...newPoints, b, vertices.lb, vertices.lt ],
    right: [ a, ...newPoints, b, vertices.rb, vertices.rt ],
  }
}