import { Application, Graphics, interaction } from "pixi.js";
import { Vector } from "../utils/Vector";
import { Ball } from "../objects/Ball";
import { getLinesIntersection } from "../utils/getLinesIntersection";
import { getBoxVertices } from "../utils/getBoxVertices";
import { setInterpolation } from "../utils/setInterpolation";
import { Ease } from "../utils/Ease";
import { isTouching } from "../isTouching";

export const setupCurveTest = (app: Application) => {
  const { width, height } = app.view;

  const bg = new Graphics();
  bg.beginFill(0)
    .drawRect(0, 0, width, height)
    .endFill();
  bg.cacheAsBitmap = true;
  app.stage.addChild(bg);
  
  const rectHeight = 40;
  const pointA = new Vector(width * .3, height * .5);
  const pointB = new Vector(width * .6, height * .5);
  
  const rect = new Graphics();
  rect.beginFill(0xee4422)
      .drawRect(pointA.x, height * .5 - rectHeight * .5, pointB.x - pointA.x, rectHeight)
      .endFill();
  app.stage.addChild(rect);
  
  const curve = new Graphics();
  app.stage.addChild(curve);

  Ball.createTexture(app, 0xffff00, 0xffffff, 20);
  const ball = new Ball();
  app.stage.addChild(ball);

  const mouseClick = (e: interaction.InteractionEvent) => {
    const touch = isTouching(rect, ball);
    if(!touch) return;

    const vA = new Vector(e.data.global);
    const vB = vA.copy();
    if(touch.top || touch.bottom){
      vA.y = 0;
      vB.y = height;
    } else {
      vA.x = 0;
      vB.x = width;
    }

    const bounds = rect.getBounds();
    const { lt, rt, lb, rb } = getBoxVertices(bounds);

    let touchLine: Vector[] = [];
    if(touch.top) touchLine = [ lt, rt ];
    if(touch.bottom) touchLine = [ lb, rb ];
    if(touch.left) touchLine = [ lt, lb ];
    if(touch.right) touchLine = [ rt, rb ];

    const point = getLinesIntersection(vA, vB, touchLine[0], touchLine[1]);

    if(!point) return;
    
    setInterpolation({
      frames: [
        {
          value: 0,
        },
        {
          value: 1,
        },
        {
          value: -.4,
        },
        {
          value: .6,
        },
        {
          value: 0,
        }
      ],
      easingFunction: Ease.inOut(3),
      duration: 600,
      onChange: (val: number|number[]) => {
        val = val as number * 100;
        const cp = point.copy();
        if(touch.top) cp.y -= val;
        if(touch.bottom) cp.y += val;
        if(touch.left) cp.x -= val;
        if(touch.right) cp.x += val;
        console.log(val)
        curve.clear()
          .beginFill(0xff1100)
          .moveTo(touchLine[0].x, touchLine[0].y)
          .quadraticCurveTo(cp.x, cp.y, touchLine[1].x, touchLine[1].y)
          .endFill();
      },
    })
  }

  const mouseMove = (e: interaction.InteractionEvent) => {
    ball.position.copyFrom(e.data.global);
  }

  app.stage.interactive = true;
  app.stage.on('mousemove', mouseMove);
  app.stage.on('click', mouseClick);
}