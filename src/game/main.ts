import { Ticker, Application, Container, interaction, Graphics } from 'pixi.js';
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

    // background
    const bg = new Graphics();
    bg.beginFill(0x000000)
      .drawRect(0, 0, width, height)
      .endFill();
    app.stage.addChild(bg);

    // setup bricks
    bricks = setupBricks(app, 0xcc11cc, width * .8, height * .35, 8, 6, 20);
    bricks.position.set(width * .1, width * .1);
    group.addChild(bricks);
    
    // setup paddle
    Paddle.createTexture(app, 0xcc1111, width * .15, 30);
    paddle = new Paddle();
    paddle.position.set(width * .5, height - 60);
    group.addChild(paddle);
    
    // setup ball
    Ball.createTexture(app, 0xccf111, 20);
    ball = new Ball();
    paddle.addBall(ball);

    // add group to stage
    app.stage.addChild(group);

    app.stage.interactive = true;
    app.stage.on('mousemove', handleMouseMove);
    app.stage.on('mousedown', handleMouseClick);

    ticker.add(process);
    ticker.start();
  }

  const process = () => {
    ball.process();
  }

  const handleMouseMove = (event: interaction.InteractionEvent) => {
    paddle.move(event.data.global.x);
  }

  const handleMouseClick = (event: interaction.InteractionEvent) => {
    ball.getGlobalPosition().copyTo(ball.position);
    app.stage.addChild(ball);
  }

  setup();

  return app;
}

const setupBricks = (app: Application, color: number, groupW: number, groupH: number, numX: number, numY: number, padding: number) => {
  const bricksW = (groupW - padding * (numX - 1)) / numX;
  const bricksH = (groupH - padding * (numY - 1)) / numY;
  const bricks = new Container();

  Brick.createTexture(app, color, bricksW, bricksH);
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