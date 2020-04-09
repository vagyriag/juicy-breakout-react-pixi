import { Sprite, Graphics, Rectangle } from "pixi.js";
import { isTouchingReturnType } from "../isTouching";
import { Vector } from "../utils/Vector";
import { getBoxVertices } from "../utils/getBoxVertices";
import { getLinesIntersection } from "../utils/getLinesIntersection";
import { setInterpolation } from "../utils/setInterpolation";
import { Ease } from "../utils/Ease";

export class Side extends Sprite {

  gr = new Graphics();
  curve = new Graphics();
  _color: number;

  constructor(color: number, x: number, y: number, width: number, height: number){
    super();
    this._color = color;

    this.gr.beginFill(this._color)
      .lineStyle(0)
      .drawRect(x, y, width, height)
      .endFill();
    this.gr.cacheAsBitmap = true;
    
    this.addChild(this.gr);
    this.addChild(this.curve);
  }

  curveByTouch(touch: isTouchingReturnType, touchPoint: Vector) {
    const vA = new Vector(touchPoint);
    const vB = vA.copy();
    if(touch.top || touch.bottom){
      vA.y = 0;
      vB.y = 99999999;
    } else {
      vA.x = 0;
      vB.x = 99999999;
    }
    const { lt, rt, lb, rb } = getBoxVertices(this.getBounds());

    let touchLine: Vector[] = [];
    if(touch.top) touchLine = [ lt, rt ];
    if(touch.bottom) touchLine = [ lb, rb ];
    if(touch.left) touchLine = [ lt, lb ];
    if(touch.right) touchLine = [ rt, rb ];

    const point = getLinesIntersection(vA, vB, touchLine[0], touchLine[1]);

    if(!point) return;
    
    setInterpolation({
      frames: [ 0, 1, -.4, .6, 0 ],
      easingFunction: Ease.inOut(3),
      duration: 600,
      onChange: (val: number|number[]) => {
        val = val as number * 100;
        const cp = point.copy();
        if(touch.top) cp.y -= val;
        if(touch.bottom) cp.y += val;
        if(touch.left) cp.x -= val;
        if(touch.right) cp.x += val;
        this.curve.clear()
          .lineStyle()
          .beginFill(this._color)
          .moveTo(touchLine[0].x, touchLine[0].y)
          .quadraticCurveTo(cp.x, cp.y, touchLine[1].x, touchLine[1].y)
          .endFill();
      },
    })
  }

  getBounds(skipUpdate?: boolean, rect?: Rectangle) {
    return this.gr.getBounds(skipUpdate);
  }
}