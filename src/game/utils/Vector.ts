import { Vector as p5Vector } from "p5";
import { Rectangle, IPoint } from "pixi.js";

export class Vector extends p5Vector implements IPoint {

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

  copyFrom(p: IPoint) {
    this.x = p.x;
    this.y = p.y;
    return this;
  }

  copyTo(p: IPoint) {
    p.x = this.x;
    p.y = this.y;
    return p;
  }

  equals(a?: any, b?: any, c?: any) {
    if(
      a instanceof Vector || // vector instance
      (typeof a === 'number' && typeof b === 'number') ||
      (a.length > 0 && a[0] instanceof Vector) // array?
    ){
      return super.equals(a, b, c);
    }
    if(a){
      return this.x === a.x && this.y === a.y;
    }
    return false;
  }

  toArray() {
    return [this.x, this.y];
  }

  static random2D() {
    return new Vector(super.random2D());
  }
}