import { DisplayObject, Ticker } from "pixi.js";
import { Vector } from "p5";
import { pI } from "./pI";

interface params {
  pos?: Vector;
}

export const enableObjectIntro = (obj: DisplayObject, enter: params, exit: params, duration: number) => {

  const ticker = new Ticker();
  let initialTime: number;
  const posEnabled = enter.pos && exit.pos;

  const start = () => {
    // set start position
    if(posEnabled) obj.position.copyFrom(enter.pos as any);
    initialTime = Date.now();
    ticker.add(process);
    ticker.start();
  }

  const process = () => {
    const now = Date.now();
    const diff = now - initialTime;
    const step = diff / duration;

    if(step >= 1){
      // set end position
      if(posEnabled) obj.position.copyFrom(exit.pos as any);
      ticker.destroy();
      return;
    }

    if(posEnabled){
      obj.position.x = pI.map(diff, 0, duration, enter.pos!.x, exit.pos!.x);
      obj.position.y = pI.map(diff, 0, duration, enter.pos!.y, exit.pos!.y);
    }
  }

  return {
    start
  }

}