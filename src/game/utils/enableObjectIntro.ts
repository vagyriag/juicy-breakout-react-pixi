import { DisplayObject, Ticker } from "pixi.js";
import { Vector } from "p5";
import { pI } from "./pI";
import Bezier from 'bezier-js';

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
      const curve = new Bezier(0,0 , .14,1.17 , .67,1.09, 1,1);
      const [ t ] = curve.intersects({
        p1: { x: step, y: -2 },
        p2: { x: step, y: 2 }
      });
      const { y: res } = curve.get(t as number);
      
      obj.position.x = enter.pos!.x + (exit.pos!.x - enter.pos!.x) * res;
      obj.position.y = enter.pos!.y + (exit.pos!.y - enter.pos!.y) * res;
    }
  }

  return {
    start
  }

}