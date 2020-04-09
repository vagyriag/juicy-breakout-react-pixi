import { Application, Graphics } from "pixi.js";
import { Vector } from "../utils/Vector";
import { interpolateLine } from "../utils/interpolateLine";
import { Ease } from "../utils/Ease";
import { setInterval } from "timers";
import chroma from 'chroma-js';

export const setupLightningsTest = (app: Application) => {
  const { width, height } = app.view;

  const maxDisplacement = 30;
  const minDisplacement = 10;
  const pointA = new Vector(width * .3, height * .5);
  const pointB = new Vector(width * .6, height * .5);

  const colors = [
    ...chroma.scale(['#ffeb3b', '#ff5722']).colors(3),
    ...chroma.scale(['#1e88e5', '#e3f2fd']).colors(10),
  ].map(c => chroma(c).num());
  
  const makeLightning = () => {
    const gr = new Graphics();
    app.stage.addChild(gr);

    const line = {
      color: colors[Math.floor(Math.random() * colors.length)],
      width: Math.random() * 3 + 1,
    }

    const points = [
      pointA,
      ...Array.from({ length: 5 })
        .map((_, i, arr) => {
          const len = 1 / (arr.length + 1) * (i + 1);
          const disp = Math.random() * (maxDisplacement + minDisplacement) - minDisplacement;
          return new Vector(pointA).lerp(pointB, len)
            .add(Vector.random2D().mult(disp));
        }),
      pointB,
    ];
  
    interpolateLine(gr, {
      vectors: points,
      enter: {
        duration: 200,
        easingFunction: Ease.inOut(2),
      },
      exit: {
        duration: 200,
        delay: -50,
        easingFunction: Ease.inOut(2),
      },
      onFinish: () => {
        app.stage.removeChild(gr);
        gr.destroy();
      },
      line
    });
  }

  setInterval(makeLightning, 100);
}