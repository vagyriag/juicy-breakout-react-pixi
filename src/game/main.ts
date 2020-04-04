import { Ticker, Application, Container, interaction } from 'pixi.js';
import { Paddle } from './objects/Paddle';
import { Brick } from './objects/Brick';

export const initGame = () => {
  
  const app = new Application({ 
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const ticker = new Ticker();

  const group = new Container();
  var paddle: Paddle;
  const bricks = new Container();

  const setup = () => {
    setupBricks();

    paddle = new Paddle(app, 0xcc1111, app.view.width * .15, 30);

    group.addChild(paddle);
    group.addChild(bricks);

    app.stage.addChild(group);

    app.stage.interactive = true;
    app.stage.on('mousemove', (event: interaction.InteractionEvent) => {
      paddle.move(event.data.global.x);
    });

    ticker.add(process);
    ticker.start();
  }

  const setupBricks = () => {
    const { width, height } = app.view;
    const bricksNumX = 8;
    const bricksNumY = 6;
    const bricksPad = 20;
    const bricksW = (width * .8 - bricksPad * (bricksNumX - 1)) / bricksNumX;
    const bricksH = (height * .35 - bricksPad * (bricksNumY - 1)) / bricksNumY;

    Brick.createTexture(app, 0xcc11cc, bricksW, bricksH);
    Array
      .from({ length: bricksNumX * bricksNumY })
      .forEach((_, index: number) => {
        const y = Math.floor(index / bricksNumX);
        const x = index - y * bricksNumX;
        const brick = new Brick(x * (bricksW + bricksPad), y * (bricksH + bricksPad));
        bricks.addChild(brick);
      });

    bricks.position.set(width * .1, width * .1);
  }

  const process = () => {

  }

  setup();

  return app;
}