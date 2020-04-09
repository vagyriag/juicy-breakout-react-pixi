import { Ticker } from "pixi.js";
import { pI } from "./pI"; 

export interface InterpolationOptions {
  frames: {
    time?: number;
    value: number|number[];
  }[];
  duration: number;
  onChange: (value: number|number[]) => void;
  delay?: number;
  autoStart?: boolean;
  autoInit?: boolean;
  easingFunction?: (t: number) => number;
  onFinish?: () => void;
}

export interface Interpolation {
  start: () => void;
}

export const setInterpolation = (options: InterpolationOptions): Interpolation => {

  const { duration, delay, frames, onFinish, onChange, autoStart = true, autoInit = true } = options;
  const easingFunction = options.easingFunction || ((t) => t);

  const resIsNum = typeof frames[0].value === 'number';

  const ticker = new Ticker();
  let initialTime: number;
  
  // flags
  let started = false;

  // initial processing
  const initialProcessing = () => {
    // calculate time for steps
    calculateStepTimes();

    if(autoInit) onChange(frames[0].value);

    // start if has delay or autoStart
    if((delay && delay > 0 && autoStart === true) || autoStart) {
      setTimeout(() => start(), delay || 0);
    }
  }

  // start transition
  const start = () => {
    if(started) return;
    initialTime = Date.now();
    ticker.add(process);
    ticker.start();
    started = true;
  }

  // ticker process
  const process = () => {
    // calculate main step (beginning to end of transition)
    const now = Date.now();
    const diff = now - initialTime;
    const outerStep = diff / duration;

    // set end position
    if(outerStep >= 1){
      onChange(frames[frames.length - 1].value);
      ticker.destroy();
      if(typeof onFinish === 'function') onFinish();
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
    // call onChange
    const result = ((resIsNum ? [frameA.value] : frameA.value) as number[])
      .map((nA, index) => {
        if(typeof nA === 'undefined') return undefined;
        const valuesB = (resIsNum ? [frameB.value] : frameB.value) as number[];
        return calc(res, nA, valuesB[index] || 0);
      });
    onChange((resIsNum ? result[0] : result) as number|number[]);
  }

  // map src to range
  const calc = (src: number, a: number, b: number) => a + (b - a) * src;

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
        return null;
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

  return { start };

}