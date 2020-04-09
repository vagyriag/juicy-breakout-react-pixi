import { Vector } from "./Vector";
import { setInterpolation, InterpolationOptions } from "./setInterpolation";
import { Graphics } from "pixi.js";

interface Options extends Omit<InterpolationOptions, 'frames'|'onChange'|'duration'|'easingFunction'> {
  vectors: Vector[];
  enter?: {
    duration: number;
  };
  exit?: {
    duration: number;
    delay?: number;
  };
}

export const interpolateLine = (gr: Graphics, { vectors, enter = { duration: 0 }, exit = { duration: 0 }, ...options }: Options) => {
  // default delay
  if(typeof exit.delay !== 'number') exit.delay = 0;

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

    const enterVal = enterT * totalLength;
    const exitVal = exitT * totalLength;

    const enterTip = getCurrentFromStep(enterVal, vectors);
    const exitTip = getCurrentFromStep(exitVal, vectors);

    // list of vectors to draw
    const line = [
      exitTip.pos,
      ...vectors.slice(exitTip.index, enterTip.index),
      enterTip.pos
    ];
    gr.clear();
    gr.lineStyle(3, 0xffff00);
    line.forEach((pt, i) => {
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