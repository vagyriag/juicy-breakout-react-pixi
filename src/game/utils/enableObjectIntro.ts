import { DisplayObject, Ticker } from "pixi.js";
import { Vector } from "p5";

interface params {
  position?: Vector;
  scale?: Vector;
  rotation?: number;
  alpha?: number;
}

export const enableObjectIntro = (obj: DisplayObject, enter: params, exit: params, duration: number, easingFunction?: (t: number) => number) => {

  const ticker = new Ticker();
  let initialTime: number;
  
  // flags
  let initCalled = false;
  const doPosition = enter.position && exit.position;
  const doScale    = enter.scale && exit.scale;
  const doRotation = typeof enter.rotation === 'number' && typeof exit.rotation === 'number';
  const doAlpha    = typeof enter.alpha === 'number' && typeof exit.alpha === 'number';
  const doNothing  = !doPosition && !doScale && !doRotation && !doAlpha;

  const start = () => {
    if(doNothing) return;
    if(!initCalled) copyValuesFrom(enter);
    initialTime = Date.now();
    ticker.add(process);
    ticker.start();
  }

  const init = () => {
    if(doNothing) return;
    copyValuesFrom(enter);
    initCalled = true;
  }

  const process = () => {
    const now = Date.now();
    const diff = now - initialTime;
    const step = diff / duration;

    if(step >= 1){
      // set end position
      copyValuesFrom(exit);
      ticker.destroy();
      return;
    }

    const res = easingFunction ? easingFunction(step) : step;
    if(doPosition){
      obj.position.x = calc(res, enter.position!.x, exit.position!.x);
      obj.position.y = calc(res, enter.position!.y, exit.position!.y);
    }
    if(doScale){
      obj.scale.x = calc(res, enter.scale!.x, exit.scale!.x);
      obj.scale.y = calc(res, enter.scale!.y, exit.scale!.y);
    }
    if(doRotation) obj.rotation = calc(res, enter.rotation!, exit.rotation!);
    if(doAlpha) obj.alpha = calc(res, enter.alpha!, exit.alpha!);
  }

  const calc = (src: number, a: number, b: number) => a + (b - a) * src;
  
  const copyValuesFrom = (src: params) => {
    if(doPosition) obj.position.copyFrom(src.position as any);
    if(doScale)    obj.scale.copyFrom(src.scale as any);
    if(doRotation) obj.rotation = src.rotation!;
    if(doAlpha)    obj.alpha = src.alpha!;
  }

  return { init, start };

}