import { Vector as p5Vector } from "p5";
import { Rectangle } from "pixi.js";

export class Vector extends p5Vector {

  constructor(x?: number | { x: number, y: number }, y?: number, z?:number) {
    if(typeof x === 'object'){
      y = x.y;
      x = x.x;
    }
    // @ts-ignore
    super(x, y, z);
  }

  static fromBox(box: Rectangle) {
    return new Vector(box.x + box.width * .5, box.y + box.height * .5);
  }
}