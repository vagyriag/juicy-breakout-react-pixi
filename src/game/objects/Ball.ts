import { Sprite, Graphics, Application, Texture } from "pixi.js";
import { isTouchingReturnType, isTouching } from "../isTouching";
import { Paddle } from "./Paddle";
import { radToDeg } from "../utils/radToDeg";
import { Vector } from "../utils/Vector";

export class Ball extends Sprite {

  static tx: Texture;

  inStage: boolean;
  vel: Vector;

  logAngles = false;

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

  bounce(touch: isTouchingReturnType) {
    const { top, right, bottom, left } = touch;
    if(top || bottom) this.vel.y *= -1;
    if(left || right) this.vel.x *= -1;
  }

  release() {
    this.inStage = true;
    this.vel.y = -10;
  }

  process(paddle: Paddle) {
    if(!this.inStage) return;

    const touch = isTouching(paddle, this);
    const alreadyTouched = paddle.justTouched.find(b => b === this);

    if(touch && !alreadyTouched){
      // if touch add to touched array
      paddle.justTouched.push(this);
      
      const maxAngMod = Math.PI * .1;
      const maxDiff = paddle.getBounds().width * .5 + this.getBounds().width * .5;
      const diff = this.position.x - paddle.position.x;
      const diffNormal = diff / maxDiff;
      const rot = maxAngMod * diffNormal;

      if(this.logAngles) console.log('\n\nincoming: ', Math.round(radToDeg(this.vel.heading())));
      this.vel.y *= -1;
      if(this.logAngles) console.log('inverted: ', Math.round(radToDeg(this.vel.heading())));
      this.vel.rotate(rot);
      if(this.logAngles) console.log('rotated: ', Math.round(rot * 180/Math.PI), Math.round(radToDeg(this.vel.heading())));

      const maxAngMult = -.18;
      const maxAng = Math.PI * maxAngMult;
      const minAng = Math.PI * -(1 + maxAngMult);
      const ang = this.vel.heading();
      if(ang > maxAng) this.vel.rotate((ang - maxAng) * -1);
      if(ang < minAng) this.vel.rotate((ang - minAng) * -1);

      if(this.logAngles) console.log('final: ', Math.round(radToDeg(this.vel.heading())), Math.round(minAng * 180/Math.PI), Math.round(maxAng * 180/Math.PI));
    }
    
    // if alreadyTouched and is far enough remove from touched array
    if(alreadyTouched && Vector.dist(new Vector(this.position), new Vector(paddle.position)) > 150){
      paddle.justTouched = paddle.justTouched.filter(b => b !== this);
    }
    
    this.position.set(...new Vector(this.position).add(this.vel).array());
  }
}