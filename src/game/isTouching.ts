import { DisplayObject, Rectangle } from "pixi.js"
import { Vector } from "./utils/Vector";

export interface isTouchingReturnType {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export const isTouching = (objA: DisplayObject, objB: DisplayObject, type: 0|1 = 0): isTouchingReturnType|false => {
  const boxA = objA.getBounds();
  const boxB = objB.getBounds();
  const touch = isTouchingBox(boxA, boxB);
  if(touch){
    const { sides } = getTouchingSidesInfo(boxA, boxB, type);
    return { ...sides };
  }
  return false;
}

export const getTouchingSidesInfo = (boxA: Rectangle, boxB: Rectangle, type: 0|1 = 0) => {
  const vectorA = Vector.fromBox(boxA);
  const vectorB = Vector.fromBox(boxB);
  const angle = Vector.sub(vectorB, vectorA).heading();

  const mod = type === 0 ? new Vector(boxB.width * .5, boxB.height * .5) : new Vector();

  let leftTop = new Vector(boxA.x - mod.x, boxA.y - mod.y);
  let rightTop = new Vector(boxA.x + boxA.width + mod.x, boxA.y - mod.y);
  
  const leftTopAng = Vector.sub(leftTop, vectorA).heading();
  const rightTopAng = Vector.sub(rightTop, vectorA).heading();
  const leftBottomAng = leftTopAng * -1;
  const rightBottomAng = rightTopAng * -1;

  const sides = { 
    top:    angle >= leftTopAng && angle < rightTopAng,
    right:  angle >= rightTopAng && angle < rightBottomAng,
    bottom: angle >= rightBottomAng && angle < leftBottomAng,
    left:   angle >= leftBottomAng || angle < leftTopAng,
  }

  return { angle, leftTopAng, rightTopAng, leftBottomAng, rightBottomAng, vectorA, vectorB, sides };
}

const isTouchingBox = (boxA: Rectangle, boxB: Rectangle) => {
  const left = boxB.x + boxB.width > boxA.x;
  const right = boxB.x < boxA.x + boxA.width;
  const top = boxB.y + boxB.height > boxA.y;
  const bottom = boxB.y < boxA.y + boxA.height;
  return left && right && top && bottom;
}