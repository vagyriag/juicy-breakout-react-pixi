import { Ticker, Application, Container, interaction, Graphics } from 'pixi.js';
import { Paddle } from './objects/Paddle';
import { Ball } from './objects/Ball';
import { setupBricks } from './utils/setupBricks';
import { isTouching } from './isTouching';
import { setupSides } from './utils/setupSides';
import { setTransition } from './utils/setTransition';
import { Vector } from './utils/Vector';
import { Ease } from './utils/Ease';
import { settings } from './utils/settings';
import { setupAngleTest } from './utils/setupAngleTest';
import { setupTransitionTest } from './utils/setupTransitionTest';

export const initGame = () => {
  
  const app = new Application({ 
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const ticker = new Ticker();

  const group = new Container();
  var paddle: Paddle;
  var bricks = new Container();
  var ball: Ball;
  var sides = new Container();

  // for debugging
  var extra = new Container();

  const setup = () => {
    const { width, height } = app.view;
    
    // background
    const bg = new Graphics()
      .beginFill(0x000000)
      .drawRect(0, 0, width, height)
      .endFill();
    app.stage.addChild(bg);

    //sides
    setupSides(app, sides, 100, 0x11cccc);
    app.stage.addChild(sides);

    // setup bricks
    bricks = setupBricks(app, bricks, 0xcc11cc, width * .8, height * .35, 8, 6, 20);
    bricks.position.set(width * .1, width * .1);
    group.addChild(bricks);

    // setup ball
    Ball.createTexture(app, 0xccf111, 0xffffff, 20);
    ball = new Ball();
    
    // setup paddle
    Paddle.createTexture(app, 0xcc1111, width * .15, 40);
    paddle = new Paddle();
    paddle.position.set(width * .5, height - 60);
    paddle.addBall(ball);
    group.addChild(paddle);
    if(settings.paddle.transition){
      setTransition(paddle, {
        frames: [
          {
            position: new Vector(paddle.position).add(0, 300),
            scale: new Vector(.3, .3),
          },
          {
            position: new Vector(paddle.position),
            scale: new Vector(1, 1),
          },
        ],
        duration: 500,
        delay: 400,
        easingFunction: Ease.out(3),
      });
    }

    // add group to stage
    app.stage.addChild(group);

    // add extra to stage
    app.stage.addChild(extra);

    app.stage.interactive = true;
    app.stage.on('mousemove', handleMouseMove);
    app.stage.on('mousedown', handleMouseClick);
    app.renderer.plugins.interaction.cursorStyles.default = 'none';

    ticker.add(process);
    ticker.start();
  }

  const process = () => {
    const touch = isTouching(paddle, ball, 1);
    const bounce = touch && ball.bounce(touch, paddle);

    if(bounce) ballTouched();

    ball.process(paddle, touch, bounce);
    paddle.process();

    bricks.children.forEach(brick => {
      const touch = isTouching(brick, ball);
      if(touch){
        ball.bounce(touch);
        bricks.removeChild(brick);
        ballTouched();
      }
    });

    sides.children.forEach(side => {
      const touch = isTouching(side, ball, 1);
      if(touch) {
        ball.bounce(touch, side);
        ballTouched();
      }
    });
  }

  const ballTouched = () => {
    if(!ball.inStage) return;
    
  }

  const handleMouseMove = (event: interaction.InteractionEvent) => {
    paddle.move(event.data.global.x);
  }

  const handleMouseClick = (event: interaction.InteractionEvent) => {
    if(ball.inStage) return;
    ball.getGlobalPosition().copyTo(ball.position);
    app.stage.addChild(ball);
    ball.release();
  }

  if(settings.test.angles){
    setupAngleTest(app);
  } else if(settings.test.transition){
    setupTransitionTest(app);
  } else {
    setup();
  }

  return app;
}