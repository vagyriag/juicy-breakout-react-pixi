import { DisplayObject, Ticker } from "pixi.js";
import { Vector } from "p5";

interface params {
  pos?: Vector;
}

export const enableObjectIntro = (obj: DisplayObject, enter: params, exit: params, duration: number, easingFunction?: (t: number) => number) => {

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

    const res = easingFunction ? easingFunction(step) : step;
    if(posEnabled){
      obj.position.x = enter.pos!.x + (exit.pos!.x - enter.pos!.x) * res;
      obj.position.y = enter.pos!.y + (exit.pos!.y - enter.pos!.y) * res;
    }
  }

  return {
    start
  }

}