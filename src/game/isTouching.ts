import { DisplayObject, Rectangle } from "pixi.js"

export interface isTouchingReturnType {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

const innerBoxSize = 5;

export const isTouching = (objA: DisplayObject, objB: DisplayObject): isTouchingReturnType|false => {
  const boxA = objA.getBounds();
  const boxB = objB.getBounds();
  const touch = isTouchingBox(boxA, boxB);
  if(touch){
    const a = getSurroundingBoxes(boxA);
    const b = getSurroundingBoxes(boxB);
    return { 
      top: isTouchingBox(a.top, b.bottom),
      right: isTouchingBox(a.right, b.left),
      bottom: isTouchingBox(a.bottom, b.top),
      left: isTouchingBox(a.left, b.right),
    }
  }
  return false;
}

const getSurroundingBoxes = (box: Rectangle) => {
  const top = box.clone();
  top.height = innerBoxSize;
  const right = box.clone();
  right.width = innerBoxSize;
  right.x += box.width - innerBoxSize;
  const bottom = box.clone();
  bottom.height = innerBoxSize;
  bottom.y += box.height - innerBoxSize;
  const left = box.clone();
  left.width = innerBoxSize;
  return { top, right, bottom, left };
}

const isTouchingBox = (boxA: Rectangle, boxB: Rectangle) => {
  const left = boxB.x + boxB.width > boxA.x;
  const right = boxB.x < boxA.x + boxA.width;
  const top = boxB.y + boxB.height > boxA.y;
  const bottom = boxB.y < boxA.y + boxA.height;
  return left && right && top && bottom;
}