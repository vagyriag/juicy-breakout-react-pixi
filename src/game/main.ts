import { Ticker, Application, Container, interaction, Graphics, Sprite } from 'pixi.js';
import { Paddle } from './objects/Paddle';
import { Ball } from './objects/Ball';
import { setupBricks } from './utils/setupBricks';
import { isTouching } from './isTouching';

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
    // TODO: remove
    if(ball.position.x < 0 || ball.position.x > app.stage.width || ball.position.y < 0){
      ball.inStage = false;
    }
    bricks.children.forEach(brick => {
      const touch = isTouching(brick, ball);
      if(touch){
        ball.bounce(touch);
        console.log(touch);
        brick.destroy();
        const s = new Sprite(Ball.tx);
        s.pivot.copyFrom(ball.pivot);
        s.position.copyFrom(ball.position);
        app.stage.addChild(s);
      }
    });
  }

  const handleMouseMove = (event: interaction.InteractionEvent) => {
    paddle.move(event.data.global.x);
  }

  const handleMouseClick = (event: interaction.InteractionEvent) => {
    ball.getGlobalPosition().copyTo(ball.position);
    app.stage.addChild(ball);
    ball.release();
  }

  setup();

  return app;
}