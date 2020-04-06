import { DisplayObject, Ticker } from "pixi.js";
import { Vector } from "p5";
import { pI } from "./pI";

interface Transformation {
  time?: number;
  position?: Vector;
  scale?: Vector;
  rotation?: number;
  alpha?: number;
}

interface Options {
  frames: Transformation[];
  duration: number;
  delay?: number;
  autoStart?: boolean;
  easingFunction?: (t: number) => number;
}

export const setTransition = (obj: DisplayObject, options: Options) => {

  const { duration, delay, autoStart = true, frames } = options;
  const easingFunction = options.easingFunction || ((t) => t);

  const ticker = new Ticker();
  let initialTime: number;
  
  // flags
  let initCalled = false;
  let started = false;
  const doPosition = frames.every(s => s.position);
  const doScale    = frames.every(s => s.scale);
  const doRotation = frames.every(s => typeof s.rotation === 'number');
  const doAlpha    = frames.every(s => typeof s.alpha === 'number');
  const doNothing  = (!doPosition && !doScale && !doRotation && !doAlpha) || frames.length < 2;

  if(!doNothing){
    frames[0].time = 0;
    frames[frames.length - 1].time = 1;
    const setted = frames // map to index or -1
      .map(({ time: t }, i) => (typeof t === 'number' && (t >= 0 || t <= 1) ? i : -1))
      .filter(n => n > 0); // without first
    if(setted.length < frames.length - 1){
      console.log(setted);
    }
  }

  const run = () => {
    // start if has delay or autoStart
    if((delay && delay > 0 && autoStart === true) || autoStart) {
      init();
      setTimeout(() => start(), delay || 0);
    }
  }

  const start = () => {
    if(doNothing || started) return;
    if(!initCalled) copyValuesFrom(frames[0]);
    initialTime = Date.now();
    ticker.add(process);
    ticker.start();
    started = true;
  }

  const init = () => {
    if(doNothing) return;
    copyValuesFrom(frames[0]);
    initCalled = true;
  }

  const process = () => {
    const now = Date.now();
    const diff = now - initialTime;
    const outerStep = diff / duration;

    if(outerStep >= 1){
      // set end position
      copyValuesFrom(frames[frames.length - 1]);
      ticker.destroy();
      return;
    }

    const index = frames.findIndex(({ time }) => (outerStep < time!));
    const frameA = frames[index - 1];
    const frameB = frames[index];
    const innerStep = pI.map(outerStep, frameA.time!, frameB.time!, 0, 1, true);
    const res = easingFunction(innerStep);
    if(doPosition){
      obj.position.x = calc(res, frameA.position!.x, frameB.position!.x);
      obj.position.y = calc(res, frameA.position!.y, frameB.position!.y);
    }
    if(doScale){
      obj.scale.x = calc(res, frameA.scale!.x, frameB.scale!.x);
      obj.scale.y = calc(res, frameA.scale!.y, frameB.scale!.y);
    }
    if(doRotation) obj.rotation = calc(res, frameA.rotation!, frameB.rotation!);
    if(doAlpha) obj.alpha = calc(res, frameA.alpha!, frameB.alpha!);
  }

  const calc = (src: number, a: number, b: number) => a + (b - a) * src;
  
  const copyValuesFrom = (src: Transformation) => {
    if(doPosition) obj.position.copyFrom(src.position as any);
    if(doScale)    obj.scale.copyFrom(src.scale as any);
    if(doRotation) obj.rotation = src.rotation!;
    if(doAlpha)    obj.alpha = src.alpha!;
  }

  //
  run();

  return { init, start };

}