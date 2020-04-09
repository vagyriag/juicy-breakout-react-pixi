import { Rectangle } from "pixi.js";
import { getBoxVertices, getBoxVerticesReturnType } from "./getBoxVertices";
import { divideLineInPoints } from "./divideLineInPoints";
import { Vector } from "./Vector";

export const fractureBox = (box: Rectangle|getBoxVerticesReturnType, a: Vector, b: Vector) => {
  const vertices = box instanceof Rectangle ? getBoxVertices(box) : box;
  const [ newPoints, part ] = divideLineInPoints(a, b, 2);
  newPoints.forEach((point) => {
    point.add(Vector.random2D().mult(part * .45));
  })
  return {
    left: [ a, ...newPoints, b, vertices.lb, vertices.lt ],
    right: [ a, ...newPoints, b, vertices.rb, vertices.rt ],
    fracture: [ a, ...newPoints, b ],
  }
}