import { Brick } from "../objects/Brick";
import { Application, Graphics, interaction } from "pixi.js";
import { Ball } from "../objects/Ball";
import { Vector } from "./Vector";
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

    gr.beginFill(0x000)
      .drawCircle(objB.x, objB.y, 4)
      .endFill();

    const line = new Vector(objB).add(objB.vel);
    gr.lineStyle(2, 0xff0000)
      .moveTo(objB.x, objB.y)
      .lineTo(line.x, line.y);
    
    const bounds = objA.getBounds();
    const points = getBoxLineIntersections(bounds, new Vector(objB), line);
    points.forEach(pt => {
      gr.beginFill(0xff0000)
        .drawCircle(pt.x, pt.y, 4)
        .endFill();
    });
  }

  app.stage.on('click', setDirection);
  app.stage.on('mousemove', process);
  setDirection({ data: { global: { x: 0, y: 0 } } } as any);
}