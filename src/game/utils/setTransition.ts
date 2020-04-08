import { DisplayObject } from "pixi.js";
import { Vector } from "p5";
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

  const { frames } = options;
  
  // flags
  let initCalled = false;
  const doPosition = frames.every(s => s.position);
  const doScale    = frames.every(s => s.scale);
  const doRotation = frames.every(s => typeof s.rotation === 'number');
  const doAlpha    = frames.every(s => typeof s.alpha === 'number');
  const doNothing  = (!doPosition && !doScale && !doRotation && !doAlpha) || frames.length < 2;

  let inter: null|Interpolation = null;

  // transform input frames to interpolation value array
  const interFrames = frames
    .map(({ time, position = {} as any, scale = {} as any, rotation, alpha }) => ({
      time,
      value: [ position.x, position.y, scale.x, scale.y, rotation, alpha ],
    }));

  // initial processing
  const initialProcessing = () => {
    if(doNothing) return;
    inter = setInterpolation({
      ...options,
      frames: interFrames,
      onChange: setValues,
    });
  }

  // start transition
  const start = () => {
    if(doNothing) return;
    if(!initCalled) setValues(interFrames[0].value)
    inter!.start();
  }

  // set initial values
  const init = () => {
    if(doNothing) return;
    setValues(interFrames[0].value);
    initCalled = true;
  }

  const setValues = (values: number|number[]) => {
    const [ posX, posY, scaleX, scaleY, rotation, alpha ] = values as number[];
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
  
  //
  initialProcessing();

  return { init, start };

}