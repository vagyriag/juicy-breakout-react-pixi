import { Sprite, Graphics, Application, Texture, DisplayObject } from "pixi.js";
import { isTouchingReturnType, isTouching } from "../isTouching";
import { Paddle } from "./Paddle";
import { Vector } from "../utils/Vector";
import { pI } from "../utils/pI";
import { setTransition } from "../utils/setTransition";
import Bezier from 'bezier-easing';

export class Ball extends Sprite {

  static tx: Texture;
  static squishyBezier = Bezier(0,1.74,.28,.77);

  inStage: boolean;
  vel: Vector;

  logAngles = false;

  lastTouched: DisplayObject|null = null;

  static createTexture(app: Application, color: number, size: number) {
    const gr = new Graphics();
    gr.beginFill(color)
      .drawCircle(0, 0, size)
      .endFill();
    this.tx = app.renderer.generateTexture(gr, 1, 1);
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
    if(obj && this.lastTouched === obj) return false;
    this.lastTouched = obj;
    const { top, right, bottom, left } = touch;
    if(top || bottom) this.vel.y *= -1;
    else if(left || right) this.vel.x *= -1;
    setTransition(this, {
      enter: {
        scale: new Vector(1.6, 1.6),
      },
      exit: {
        scale: new Vector(1, 1),
      },
      duration: 1000,
      autoStart: true,
      easingFunction: Ball.squishyBezier,
    });
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
}