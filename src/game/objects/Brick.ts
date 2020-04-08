import { Sprite, Texture, Graphics, Application } from "pixi.js";
import chroma from 'chroma-js';

export class Brick extends Sprite {

  static tx: Texture;
  static txDists: Texture[];
  static hitTextureDuration = 200;

  lastTxChangedTime = 0;

  static createTexture(app: Application, color: number, width: number, height: number) {
    const gr = new Graphics();
    gr.beginFill(color)
      .drawRect(0, 0, width, height)
      .endFill();
    this.tx = app.renderer.generateTexture(gr, 1, 1);

    this.txDists = chroma
      .scale(['blue', 'white'])
      .colors(20)
      .map((col) => {
        gr.clear()
          .beginFill(chroma(col).num())
          .drawRect(0, 0, width, height)
          .endFill();
        return app.renderer.generateTexture(gr, 1, 1);
      });
  }

  constructor(x: number, y: number) {
    super(Brick.tx);
    const box = this.getBounds();
    const wH = box.width * .5;
    const hH = box.height * .5;
    this.pivot.set(wH, hH);
    this.position.set(x, y);
  }

  changeTexture(n: number) {
    if(n < 0) n = 0;
    if(n > 1) n = 1;
    const index = Math.floor(n * (Brick.txDists.length - 1));
    this.texture = Brick.txDists[index];
    this.lastTxChangedTime = Date.now();
  }

  process() {
    if(this.texture !== Brick.tx){
      const diff = Date.now() - this.lastTxChangedTime;
      if(diff > Brick.hitTextureDuration) this.texture = Brick.tx;
    }
  }
  
}