import { Brick } from "../objects/Brick";
import { Application, Graphics, interaction } from "pixi.js";
import { Ball } from "../objects/Ball";
import { Vector } from "./Vector";
import { fractureBox } from "./fractureBox";
import { getBoxVertices } from "./getBoxVertices";
import { getBoxLineIntersections } from "./getBoxLineIntersections";

export const setupFractureTest = (app: Application) => {
  const { width, height } = app.view;
  
  Brick.createTexture(app, 0xcc11cc, 200, 50);
  const objA = new Brick(width * .5, height * .5);
  app.stage.addChild(objA);

  Ball.createTexture(app, 0xccf111, 0xccf111, 20);
  const objB = new Ball();
  app.stage.addChild(objB);

  app.stage.interactive = true;
  const gr = new Graphics();
  app.stage.addChild(gr);

  const setDirection = (ev: interaction.InteractionEvent) => {
    objB.vel = Vector.random2D();
    objB.vel.setMag(200);
    process(ev);
  }

  const process = (ev: interaction.InteractionEvent) => {
    objB.position.copyFrom(ev.data.global);

    gr.clear();
    
    const line = new Vector(objB).add(objB.vel);

    gr.beginFill(0xccf111)
      .drawCircle(line.x, line.y, 4)
      .endFill();
    
    const bounds = objA.getBounds();
    const vertices = getBoxVertices(bounds);
    const points = getBoxLineIntersections(vertices, new Vector(objB), line);
    const res = points.length === 2 && fractureBox(bounds, points[0], points[1]);
    
    if(res){
      gr.beginFill(0xff0000);
      res.left.forEach((pt, i) => {
          gr[i === 0 ? 'moveTo' : 'lineTo'](pt.x, pt.y);
      });
      gr.closePath();
      gr.endFill();

      gr.beginFill(0x00ff00);
      res.right.forEach((pt, i) => {
          gr[i === 0 ? 'moveTo' : 'lineTo'](pt.x, pt.y);
      });
      gr.closePath();
      gr.endFill();
    }
  }

  app.stage.on('click', setDirection);
  app.stage.on('mousemove', process);
  setDirection({ data: { global: { x: 0, y: 0 } } } as any);
}
