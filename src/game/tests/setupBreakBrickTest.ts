import { Brick } from "../objects/Brick";
import { Application, interaction } from "pixi.js";
import { Ball } from "../objects/Ball";
import { isTouching } from "../isTouching";
import { breakBrick } from "../utils/breakBrick";

export const setupBreakBrickTest = (app: Application) => {
  const { width, height } = app.view;
  
  Brick.createTexture(app, 0xcc11cc, 200, 50);
  const objA = new Brick(width * .5, height * .5);
  app.stage.addChild(objA);

  Ball.createTexture(app, 0xccf111, 0xccf111, 0);
  const objB = new Ball();
  app.stage.addChild(objB);

  app.stage.interactive = true;

  const info = document.createElement('pre');
  info.style.position = 'fixed';
  info.style.top = '0px';
  info.style.left = '0px';
  info.style.color = 'white';
  info.style.margin = '0px';
  info.style.padding = '20px';
  document.body.appendChild(info);

  const process = (ev: interaction.InteractionEvent) => {
    objB.position.copyFrom(ev.data.global);

    const touch = isTouching(objA, objB);
    const side = touch && Object.keys(touch).find((k) => (touch as any)[k]);
    info.innerText = side || '';

    if(!touch) return;
    
    //setInterval(() => breakBrick(app, touch, objA, objB), 100)
    breakBrick(app, touch, objA, objB);
  }

  app.stage.on('click', process);
}