import { Ticker, Application, Container, interaction } from 'pixi.js';
import { Paddle } from './objects/Paddle';
import { Brick } from './objects/Brick';
import { Ball } from './objects/Ball';

export const initGame = () => {
  
  const app = new Application({ 
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const ticker = new Ticker();

  const group = new Container();
  var paddle: Paddle;
  var bricks: Container;
  var ball: Ball;

  const setup = () => {
    const { width, height } = app.view;
    
    bricks = setupBricks(app, width * .8, height * .35, 8, 6, 20);
    bricks.position.set(width * .1, width * .1);

    Ball.createTexture(app, 0xccf111, 20);
    ball = new Ball(100, 100);

    paddle = new Paddle(app, 0xcc1111, app.view.width * .15, 30);

    group.addChild(paddle);
    group.addChild(bricks);
    group.addChild(ball);

    app.stage.addChild(group);

    app.stage.interactive = true;
    app.stage.on('mousemove', (event: interaction.InteractionEvent) => {
      paddle.move(event.data.global.x);
    });

    ticker.add(process);
    ticker.start();
  }

  

  const process = () => {

  }

  setup();

  return app;
}

const setupBricks = (app: Application, groupW: number, groupH: number, numX: number, numY: number, padding: number) => {
  const bricksW = (groupW - padding * (numX - 1)) / numX;
  const bricksH = (groupH - padding * (numY - 1)) / numY;
  const bricks = new Container();

  Brick.createTexture(app, 0xcc11cc, bricksW, bricksH);
  Array
    .from({ length: numX * numY })
    .forEach((_, index: number) => {
      const y = Math.floor(index / numX);
      const x = index - y * numX;
      const brick = new Brick(x * (bricksW + padding), y * (bricksH + padding));
      bricks.addChild(brick);
    });

  return bricks;
}