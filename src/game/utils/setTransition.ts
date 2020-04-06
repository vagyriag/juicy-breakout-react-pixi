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

  // initial processing
  const initialProcessing = () => {
    // calculate time for steps
    if(!doNothing) calculateStepTimes();

    // start if has delay or autoStart
    if((delay && delay > 0 && autoStart === true) || autoStart) {
      init();
      setTimeout(() => start(), delay || 0);
    }
  }

  // start transition
  const start = () => {
    if(doNothing || started) return;
    if(!initCalled) copyValuesFrom(frames[0]);
    initialTime = Date.now();
    ticker.add(process);
    ticker.start();
    started = true;
  }

  // set initial values
  const init = () => {
    if(doNothing) return;
    copyValuesFrom(frames[0]);
    initCalled = true;
  }

  // ticker process
  const process = () => {
    // calculate main step (beginning to end of transition)
    const now = Date.now();
    const diff = now - initialTime;
    const outerStep = diff / duration;

    // set end position
    if(outerStep >= 1){
      copyValuesFrom(frames[frames.length - 1]);
      ticker.destroy();
      return;
    }

    // get next frame index
    const index = frames.findIndex(({ time }) => (outerStep < time!));
    // get frames for current transition
    const frameA = frames[index - 1];
    const frameB = frames[index];
    // calculate inner step (number between 0 and 1, inside the frames time range)
    const innerStep = pI.map(outerStep, frameA.time!, frameB.time!, 0, 1, true);
    // calculate modifier (y position for x = innerStep)
    const res = easingFunction(innerStep);
    // apply to relevant parameter
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

  // map src to range
  const calc = (src: number, a: number, b: number) => a + (b - a) * src;
  
  const copyValuesFrom = (src: Transformation) => {
    if(doPosition) obj.position.copyFrom(src.position as any);
    if(doScale)    obj.scale.copyFrom(src.scale as any);
    if(doRotation) obj.rotation = src.rotation!;
    if(doAlpha)    obj.alpha = src.alpha!;
  }

  const calculateStepTimes = () => {
    // set first and last frames with 0 and 1
    frames[0].time = 0;
    frames[frames.length - 1].time = 1;

    // only makes sense if there's more than 2
    if(frames.length === 2) return;

    // get frames with time set
    const setted = frames // map to index or -1
      .map(({ time: t }, i) => (typeof t === 'number' && (t >= 0 || t <= 1) ? i : -1))
      .filter(n => n >= 0); // remove -1

    setted.slice(1) // remove first (0)
      .map((curr, i) => {
        const prev = setted[i];
        // only return group if is not consecutive
        if(prev + 1 < curr) return [prev,curr];
      })
      .filter(v => v) // remove emtpy values
      .forEach(([aIndex, bIndex]: any) => {
        //console.log(aIndex, bIndex);
        const frameA = frames[aIndex];
        let frameB = frames[bIndex];
        // to prevent range errors
        if(frameA.time! > frameB.time!) frameB = frameA;
        // dime difference in range
        const timeDiff = frameB.time! - frameA.time!;
        // diff between indexes (spaces between)
        const indexDiff = bIndex - aIndex;
        // time division
        const timeStep = timeDiff / indexDiff;
        // loop spaces to fill (indexDiff - 1)
        Array.from({ length: indexDiff - 1 })
          .forEach((_, i) => {
            // empty index
            const modIndex = aIndex + i + 1;
            // beginning + step
            const modTime = frameA.time! + timeStep * (i + 1);
            frames[modIndex].time = modTime;
          });
      });
  }

  //
  initialProcessing();

  return { init, start };

}