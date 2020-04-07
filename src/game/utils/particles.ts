import { Container, IPoint, Texture, Application, Graphics } from "pixi.js";
import * as particles from 'pixi-particles';

let emitter: particles.Emitter;
let elapsed = Date.now();

const setup = (app: Application, cont: Container) => {
  const gr = new Graphics();
  gr.beginFill(0xffffff)
    .drawCircle(0, 0, 20)
    .endFill();
  const tx = app.renderer.generateTexture(gr, 1, 1);
  
  emitter = new particles.Emitter(
    cont,
    [ tx ],
    {
      "alpha": {
        "start": 0.3,
        "end": 0.43
      },
      "scale": {
        "start": 0.32,
        "end": 0.01,
        "minimumScaleMultiplier": 1.02
      },
      "color": {
        "start": "#e680ed",
        "end": "#ff0000"
      },
      "speed": {
        "start": 30,
        "end": 50,
        "minimumSpeedMultiplier": 1.03
      },
      "acceleration": {
        "x": 0,
        "y": 0
      },
      "maxSpeed": 0,
      "startRotation": {
        "min": 0,
        "max": 360
      },
      "noRotation": true,
      "rotationSpeed": {
        "min": 0,
        "max": 0
      },
      "lifetime": {
        "min": 0.39,
        "max": 0.9
      },
      "blendMode": "normal",
      "frequency": 0.001,
      "emitterLifetime": 0.1,
      "maxParticles": 100,
      "pos": {
        "x": 0,
        "y": 0
      },
      "addAtBack": false,
      "spawnType": "point"
    }
  );
}

const hit = (point: IPoint) => {
  emitter.updateSpawnPos(point.x, point.y);
  emitter.resetPositionTracking();
  emitter.emit = true;
}

const update = () => {
  const now = Date.now();
  const diff = now - elapsed;

  if(emitter.emit && diff > 500) emitter.emit = false;

  emitter.update(diff * 0.001);
  elapsed = now;
}

export default {
  setup,
  hit,
  update,
}