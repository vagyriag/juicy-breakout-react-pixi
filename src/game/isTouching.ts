import { DisplayObject, Rectangle } from "pixi.js"
import { Vector } from "./utils/Vector";

export interface isTouchingReturnType {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export const isTouching = (objA: DisplayObject, objB: DisplayObject): isTouchingReturnType|false => {
  const boxA = objA.getBounds();
  const boxB = objB.getBounds();
  const touch = isTouchingBox(boxA, boxB);
  if(touch){
    const vectorA = Vector.fromBox(boxA);
    const vectorB = Vector.fromBox(boxB);
    const angle = Vector.sub(vectorB, vectorA).heading();

    const leftTop = new Vector(boxA.x - boxB.width * .5, boxA.y - boxB.height * .5);
    const rightTop = new Vector(boxA.x + boxA.width + boxB.width * .5, boxA.y - boxB.height * .5);
    
    const leftTopAng = Vector.sub(leftTop, vectorA).heading();
    const rightTopAng = Vector.sub(rightTop, vectorA).heading();
    const leftBottomAng = leftTopAng * -1;
    const rightBottomAng = rightTopAng * -1;
    
    return { 
      top:    angle >= leftTopAng && angle < rightTopAng,
      right:  angle >= rightTopAng && angle < rightBottomAng,
      bottom: angle >= rightBottomAng && angle < leftBottomAng,
      left:   angle >= leftBottomAng || angle < leftTopAng,
    }
  }
  return false;
}

const isTouchingBox = (boxA: Rectangle, boxB: Rectangle) => {
  const left = boxB.x + boxB.width > boxA.x;
  const right = boxB.x < boxA.x + boxA.width;
  const top = boxB.y + boxB.height > boxA.y;
  const bottom = boxB.y < boxA.y + boxA.height;
  return left && right && top && bottom;
}