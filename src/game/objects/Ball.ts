import { Sprite, Graphics, Application, Texture, DisplayObject } from "pixi.js";
import { isTouchingReturnType, isTouching, withTouchTransform } from "../isTouching";
import { Paddle } from "./Paddle";
import { Vector } from "../utils/Vector";
import { pI } from "../utils/pI";
import { setTransition } from "../utils/setTransition";
import Bezier from 'bezier-easing';
import { settings } from "../utils/settings";
import { Ease } from "../utils/Ease";

export class Ball extends Sprite implements withTouchTransform {

  static tx: Texture;
  static txBounce: Texture;
  static squishyBezier = Bezier(0,1.54,.37,.74);
  static wobbleEase = Ease.inOut(1.5);
  static bounceTextureDuration = 100;

  inStage: boolean;
  vel: Vector;

  logAngles = false;

  lastTouchedObj: DisplayObject|null = null;
  lastTouchedTime: number = 0;

  touchTransform = {
    scale: new Vector(1, 1),
    rotation: 0,
  }

  static createTexture(app: Application, color: number, colorBounce: number, size: number) {
    const gr = new Graphics();
    gr.beginFill(color)
      .drawCircle(0, 0, size)
      .endFill();
    // regular
    this.tx = app.renderer.generateTexture(gr, 1, 1);
    gr.clear()
      .beginFill(colorBounce)
      .drawCircle(0, 0, size)
      .endFill();
    // bounce
    this.txBounce = app.renderer.generateTexture(gr, 1, 1);
  }

  constructor() {
    super(Ball.tx);
    const box = this.getBounds();
    const wH = box.width * .5;
    const hH = box.height * .5;
    this.pivot.set(wH, hH);
    this.inStage = false;
    this.vel = new Vector();
  }

  bounce(touch: isTouchingReturnType, obj: DisplayObject|null = null) {
    if(!this.inStage) return false;
    if(obj && this.lastTouchedObj === obj) return false;
    this.lastTouchedObj = obj;
    const { top, right, bottom, left } = touch;
    if(top || bottom) this.vel.y *= -1;
    else if(left || right) this.vel.x *= -1;
    // wobble (plus squishy if enabled)
    if(settings.ball.wobble) this.setWobble(settings.ball.squishy);
    // only squishy
    else if(settings.ball.squishy) this.setSquishy();
    if(settings.ball.bounceColor) {
      this.lastTouchedTime = Date.now();
      this.texture = Ball.txBounce;
    }
    return true;
  }

  release() {
    this.inStage = true;
    this.vel = new Vector(0, -10);
    const arc = Math.PI * .3;
    const r = Math.random() * arc - arc * .5;
    this.vel.rotate(r);
  }

  process(paddle: Paddle) {
    if(!this.inStage) return;

    if(this.texture === Ball.txBounce){
      const diff = Date.now() - this.lastTouchedTime;
      if(diff > Ball.bounceTextureDuration) this.texture = Ball.tx;
    }

    if(settings.ball.scale) this.scale.set(1.5, 1);
    if(settings.ball.rotation) this.rotation = this.vel.heading();

    const touch = isTouching(paddle, this, 1);
    let bounced = false;

    if(touch) bounced = this.bounce(touch, paddle);

    if(touch && touch.top && bounced){
      const maxAngMod = Math.PI * .1;
      const maxDiff = paddle.getBounds().width * .5 + this.getBounds().width * .5;
      const diff = this.position.x - paddle.position.x;
      const diffNormal = diff / maxDiff;
      const rot = maxAngMod * diffNormal;

      if(this.logAngles) console.log('\n\nincoming: ', Math.round(pI.degrees(this.vel.heading())));
      if(this.logAngles) console.log('inverted: ', Math.round(pI.degrees(this.vel.heading())));
      this.vel.rotate(rot);
      if(this.logAngles) console.log('rotated: ', Math.round(rot * 180/Math.PI), Math.round(pI.degrees(this.vel.heading())));

      const maxAngMult = -.18;
      const maxAng = Math.PI * maxAngMult;
      const minAng = Math.PI * -(1 + maxAngMult);
      const ang = this.vel.heading();
      if(ang > maxAng) this.vel.rotate((ang - maxAng) * -1);
      if(ang < minAng) this.vel.rotate((ang - minAng) * -1);

      if(this.logAngles) console.log('final: ', Math.round(pI.degrees(this.vel.heading())), Math.round(minAng * 180/Math.PI), Math.round(maxAng * 180/Math.PI));
    }
    
    this.position.set(...new Vector(this.position).add(this.vel).array());
  }

  setSquishy() {
    setTransition(this, {
      frames: [
        { scale: new Vector(1.5, 1.5) },
        { scale: new Vector(this.scale) },
      ],
      duration: 50,
      autoStart: true,
      easingFunction: Ball.squishyBezier,
    });
  }

  setWobble(squishy: boolean) {
    const initialScale = new Vector(this.scale);
    setTransition(this, {
      frames: [
        { scale: squishy ? new Vector(1.5, 1.5) : initialScale },
        { scale: new Vector(1.4, .7) },
        { scale: new Vector(1, 1.3) },
        { scale: new Vector(1.2, .8) },
        { scale: initialScale },
      ],
      duration: 800,
      autoStart: true,
      easingFunction: Ball.wobbleEase,
    });
  }
}