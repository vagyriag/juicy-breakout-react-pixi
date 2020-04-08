import { Rectangle } from "pixi.js";
import { Vector } from "./Vector";

export interface getBoxVerticesReturnType {
  lt: Vector;
  rt: Vector;
  rb: Vector;
  lb: Vector;
}

export const getBoxVertices = (box: Rectangle): getBoxVerticesReturnType => {
  return { 
    lt: new Vector(box),
    rt: new Vector(box).add(box.width, 0),
    rb: new Vector(box).add(box.width, box.height),
    lb: new Vector(box).add(0, box.height),
  };
}
