import { Sprite, Graphics, Application, Texture } from "pixi.js";
import Victor from "victor";
import { isTouchingReturnType, isTouching } from "../isTouching";
import { Paddle } from "./Paddle";

export class Ball extends Sprite {

  static tx: Texture;

  inStage: boolean;
  vel: Victor;

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
    this.vel = new Victor(0, 0);
  }

  bounce(touch: isTouchingReturnType) {
    const { top, right, bottom, left } = touch;
    if(top || bottom) this.vel.invertY();
    if(left || right) this.vel.invertX();
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

      if(this.logAngles) console.log('\n\nincoming: ', Math.round(this.vel.angleDeg()));
      this.vel.invertY();
      if(this.logAngles) console.log('inverted: ', Math.round(this.vel.angleDeg()));
      this.vel.rotate(rot);
      if(this.logAngles) console.log('rotated: ', Math.round(rot * 180/Math.PI), Math.round(this.vel.angleDeg()));

      const maxAngMult = -.18;
      const maxAng = Math.PI * maxAngMult;
      const minAng = Math.PI * -(1 + maxAngMult);
      const ang = this.vel.angle();
      if(ang > maxAng) this.vel.rotate((ang - maxAng) * -1);
      if(ang < minAng) this.vel.rotate((ang - minAng) * -1);

      if(this.logAngles) console.log('final: ', Math.round(this.vel.angleDeg()), Math.round(minAng * 180/Math.PI), Math.round(maxAng * 180/Math.PI));
    }
    
    // if alreadyTouched and is far enough remove from touched array
    if(alreadyTouched && Victor.fromObject(this.position).distance(Victor.fromObject(paddle.position)) > 150){
      paddle.justTouched = paddle.justTouched.filter(b => b !== this);
    }

    this.position.set(...Victor.fromObject(this.position).add(this.vel).toArray());
  }
}