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
import { pI } from './utils/pI';
import { sound } from './utils/sound';
import { Brick } from './objects/Brick';
import particles from './utils/particles';
import { setupBreakBrickTest } from './utils/setupBreakBrickTest';
import { setupInterpolationTest } from './utils/setupInterpolationTest';
import { breakBrick } from './utils/breakBrick';
import { setupLightningsTest } from './utils/setupLightningsTest';

export const initGame = () => {

  sound.load();
  
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

  let canMovePaddle = !settings.paddle.transition;

  const setup = () => {
    const { width, height } = app.view;

    particles.setup(app, group);
    
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
    bricks.position.copyFrom(new Vector(bricks).add(width * .1, width * .1));
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
        onFinish: () => {
          canMovePaddle = true;
          if(settings.test.autoStart) {
            handleMouseClick(null as any);
            paddle.position.y = -100;
          }
        }
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
    paddle.process();
    if(!ball.inStage) return;
    particles.update();

    const touch = isTouching(paddle, ball, 1);
    const bounce = touch && ball.bounce(touch, paddle);

    if(bounce) {
      wobbleBricks();
      sound.paddle();
    }

    ball.process(paddle, touch, bounce);

    bricks.children.some(brick => {
      if(brick instanceof Brick) brick.process();
      const touch = isTouching(brick, ball);
      if(touch){
        breakBrick(app, touch, brick, ball);
        ball.bounce(touch);
        bricks.removeChild(brick);
        wobbleBricks(true);
        sound.brick();
      }
      return touch;
    });

    sides.children.forEach(side => {
      const touch = isTouching(side, ball, 1);
      if(touch) {
        ball.bounce(touch, side);
        wobbleBricks();
        sound.wall();
      }
    });
  }

  const wobbleBricks = (touchedBrick?: boolean) => {
    if(!ball.inStage) return;
    particles.hit(ball.position)

    const minDist = Brick.tx.width;
    const maxDist = app.view.width/2;
    const point = new Vector(ball);
    bricks.children.forEach(brick => {
      const dist = !touchedBrick ? 0 : new Vector(brick.getGlobalPosition()).dist(point);
      const delay = !touchedBrick ? Math.random() * 70 : pI.map(dist, minDist, maxDist, 0, 200, true);
      const color = !touchedBrick ? Math.random() : dist/maxDist;

      if(settings.brick.color && brick instanceof Brick) brick.changeTexture(color);

      if(settings.brick.wobble) setTransition(brick, {
        frames: [
          {
            scale: new Vector(1, 1),
            rotation: 0
          },
          {
            scale: new Vector(1.1, 1.1),
            rotation: Math.random() * .2 - .1
          },
          {
            scale: new Vector(0.9, 0.9),
            rotation: Math.random() * .2 - .1
          },
          {
            scale: new Vector(1, 1),
            rotation: 0
          }
        ],
        duration: 200,
        delay,
      });
    });
  }

  const handleMouseMove = (event: interaction.InteractionEvent) => {
    if(canMovePaddle) paddle.move(event.data.global.x);
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
  } else if(settings.test.brickBreak){
    setupBreakBrickTest(app);
  } else if(settings.test.interpolation){
    setupInterpolationTest();
  } else if(settings.test.lightnings){
    setupLightningsTest(app);
  } else {
    setup();
  }

  return app;
}