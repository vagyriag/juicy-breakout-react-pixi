import { Vector } from "./Vector";
import { setInterpolation, InterpolationOptions } from "./setInterpolation";
import { Graphics } from "pixi.js";

interface Options extends Omit<InterpolationOptions, 'frames'|'onChange'> {
  vectors: Vector[];
}

export const interpolateLine = (gr: Graphics, { vectors, ...options }: Options) => {

  const totalLength = vectors.slice(1).reduce((acc, curr, index) => {
    return acc + Vector.sub(curr, vectors[index]).mag();
  }, 0);

  const drawLightning = (outerVal: number|number[]) => {
    outerVal = outerVal as number;
    let maxLength = 0;
    let prevLength = 0;
    const lastCompleted = vectors.slice(1).findIndex((curr, index) => {
      maxLength += Vector.sub(curr, vectors[index]).mag();
      if(maxLength >= outerVal) return true;
      prevLength = maxLength;
      return false;
    });
    
    const innerVal = (outerVal - prevLength) / (maxLength - prevLength);
    const completed = vectors.slice(0, lastCompleted);
    const prev = vectors[lastCompleted];
    const current = vectors[lastCompleted + 1];
    const end = prev.copy().lerp(current, innerVal);
    gr.clear();
    gr.lineStyle(3, 0xffff00);
    gr.moveTo(vectors[0].x, vectors[0].y);
    completed.forEach((pt, i) => {
      gr.lineTo(pt.x, pt.y);
    });
    gr.lineTo(prev.x, prev.y);
    gr.lineTo(end.x, end.y);
  }

  setInterpolation({
    frames: [ { value: 0 }, { value: totalLength } ],
    onChange: drawLightning,
    ...options
  });

  return gr;
}