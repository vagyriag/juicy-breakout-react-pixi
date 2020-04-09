import { Vector } from "./Vector";
import { setInterpolation, InterpolationOptions } from "./setInterpolation";
import { Graphics } from "pixi.js";

interface Options extends Omit<InterpolationOptions, 'frames'|'onChange'> {
  vectors: Vector[];
  enter?: boolean;
  exit?: boolean;
  delayBetween?: number;
}

export const interpolateLine = (gr: Graphics, { vectors, enter: doEnter = true, exit: doExit, delayBetween = 100, ...options }: Options) => {
  // vectors = vectors.slice().reverse();
  // total line length
  const totalLength = vectors.slice(1).reduce((acc, curr, index) => {
    return acc + Vector.sub(curr, vectors[index]).mag();
  }, 0);

  const draw = (t: number|number[]) => {
    const enterVal = t as number * totalLength;
    const exitVal = enterVal - 30;

    const enter = getCurrentFromStep(enterVal, vectors);
    const exit = getCurrentFromStep(exitVal, vectors);

    // list of vectors to draw
    const line = [
      exit.pos,
      ...vectors.slice(exit.index, enter.index),
      enter.pos
    ];
    gr.clear();
    gr.lineStyle(3, 0xffff00);
    line.forEach((pt, i) => {
      gr[i === 0 ? 'moveTo' : 'lineTo'](pt.x, pt.y);
    });
  }

  setInterpolation({
    frames: [{value: 0}, {value: 1}],
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