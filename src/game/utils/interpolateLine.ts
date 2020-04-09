import { Vector } from "./Vector";
import { setInterpolation, InterpolationOptions } from "./setInterpolation";
import { Graphics } from "pixi.js";

interface Options extends Omit<InterpolationOptions, 'frames'|'onChange'|'duration'|'easingFunction'> {
  vectors: Vector[];
  enter?: {
    duration: number;
    easingFunction?: InterpolationOptions['easingFunction'];
  };
  exit?: {
    duration: number;
    delay?: number;
    easingFunction?: InterpolationOptions['easingFunction'];
  };
  line: {
    color: number,
    width: number,
  }
}

export const interpolateLine = (gr: Graphics, { vectors, line, enter = { duration: 0 }, exit = { duration: 0 }, ...options }: Options) => {
  // defaults
  if(enter.duration < 0) enter.duration = 0;
  if(exit.duration < 0) exit.duration = 0;
  if(typeof exit.delay !== 'number' || exit.delay < enter.duration) exit.delay = 0;
  if(!enter.easingFunction) enter.easingFunction = t => t;
  if(!exit.easingFunction) exit.easingFunction = t => t;

  // total line length
  const totalLength = vectors.slice(1).reduce((acc, curr, index) => {
    return acc + Vector.sub(curr, vectors[index]).mag();
  }, 0);

  const totalDuration = enter.duration + exit.delay + exit.duration;
  if(totalDuration <= 0) return gr;

  const map = (val: number, min: number, max: number) => {
    let res = (val - min) / (max - min);
    if(res < 0) res = 0;
    if(res > 1) res = 1;
    return res;
  }
  
  const draw = (t: number|number[]) => {
    const current = t as number * totalDuration
    const enterT = map(current, 0, enter.duration);
    const exitT = map(current, enter.duration + exit.delay!, totalDuration);

    const enterVal = enter.easingFunction!(enterT) * totalLength;
    const exitVal = exit.easingFunction!(exitT) * totalLength;

    const enterTip = getCurrentFromStep(enterVal, vectors);
    const exitTip = getCurrentFromStep(exitVal, vectors);

    // list of vectors to draw
    const lineVectors = [
      exitTip.pos,
      ...vectors.slice(exitTip.index, enterTip.index),
      enterTip.pos
    ];
    gr.clear();
    gr.lineStyle(line.width, line.color);
    lineVectors.forEach((pt, i) => {
      gr[i === 0 ? 'moveTo' : 'lineTo'](pt.x, pt.y);
    });
  }

  setInterpolation({
    frames: [{value: 0}, {value: 1}],
    duration: totalDuration,
    onChange: draw,
    ...options
  });

  return gr;
}

const getCurrentFromStep = (step: number, vectors: Vector[]) => {
  // max length of current segment
  let maxLength = 0;
  // length until previous segment
  let prevLength = 0;
  // last completed index
  const index = 1 + vectors.slice(1).findIndex((curr, index) => {
    maxLength += Vector.sub(curr, vectors[index]).mag();
    if(maxLength >= step) return true;
    prevLength = maxLength;
    return false;
  });
  // current segment step
  const innerVal = (step - prevLength) / (maxLength - prevLength);
  // prev vector
  const prev = vectors[index - 1];
  // next vector
  const next = vectors[index];
  // interpolation between prev and next in step
  const pos = prev.copy().lerp(next, innerVal);
  // return current index and pos
  return { index, pos };
}