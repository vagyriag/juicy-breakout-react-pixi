import { DisplayObject, Ticker } from "pixi.js";
import { Vector } from "p5";
import { pI } from "./pI";
import { setInterpolation, Interpolation } from "./setInterpolation";

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
  onFinish?: () => void;
}

export const setTransition = (obj: DisplayObject, options: Options) => {

  const { duration, delay, autoStart = true, frames, onFinish } = options;
  
  // flags
  let initCalled = false;
  const doPosition = frames.every(s => s.position);
  const doScale    = frames.every(s => s.scale);
  const doRotation = frames.every(s => typeof s.rotation === 'number');
  const doAlpha    = frames.every(s => typeof s.alpha === 'number');
  const doNothing  = (!doPosition && !doScale && !doRotation && !doAlpha) || frames.length < 2;

  let inter: null|Interpolation = null;

  // initial processing
  const initialProcessing = () => {
    // calculate time for steps
    if(!doNothing) {
      inter = setInterpolation({
        ...options,
        frames: frames.map(({ time, position = {} as any, scale = {} as any, rotation, alpha }) => ({
          time,
          value: [ position.x, position.y, scale.x, scale.y, rotation, alpha ],
        })),
        onChange: process,
      });
    }

    // start if has delay or autoStart
    if((delay && delay > 0 && autoStart === true) || autoStart) {
      init();
      setTimeout(() => start(), delay || 0);
    }
  }

  // start transition
  const start = () => {
    if(doNothing || !inter) return;
    if(!initCalled) copyValuesFrom(frames[0]);
    inter.start();
  }

  // set initial values
  const init = () => {
    if(doNothing) return;
    copyValuesFrom(frames[0]);
    initCalled = true;
  }

  // ticker process
  const process = (value: number|number[]) => {
    const [ posX, posY, scaleX, scaleY, rotation, alpha ] = value as number[];
    if(doPosition){
      obj.position.x = posX;
      obj.position.y = posY;
    }
    if(doScale){
      obj.scale.x = scaleX;
      obj.scale.y = scaleY;
    }
    if(doRotation) obj.rotation = rotation;
    if(doAlpha) obj.alpha = alpha;
  }

  const copyValuesFrom = (src: Transformation) => {
    if(doPosition) obj.position.copyFrom(src.position as any);
    if(doScale)    obj.scale.copyFrom(src.scale as any);
    if(doRotation) obj.rotation = src.rotation!;
    if(doAlpha)    obj.alpha = src.alpha!;
  }
  
  //
  initialProcessing();

  return { init, start };

}