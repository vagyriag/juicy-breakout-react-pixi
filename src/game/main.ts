import * as PIXI from 'pixi.js';
import { Paddle } from './objects/Paddle';

export const initGame = () => {
  
  const app = new PIXI.Application({ 
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const ticker = new PIXI.Ticker();

  const group = new PIXI.Container();
  var paddle: Paddle;

  const setup = () => {
    paddle = new Paddle(app, 0xcc1111, app.view.width * .15, 30);

    group.addChild(paddle);

    app.stage.addChild(group);

    app.stage.interactive = true;
    app.stage.on('mousemove', (event: PIXI.interaction.InteractionEvent) => {
      paddle.move(event.data.global.x);
    });

    ticker.add(process);
    ticker.start();

    setTimeout(() => console.clear(), 100);
  }

  const process = () => {

  }

  setup();

  return app;
}