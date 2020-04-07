import { Howl } from "howler";
import { settings } from "./settings";

let bricks: Howl[];
let lastBrickHitTime = 0;
let lastBrickHitIndex = 0;

let paddle: Howl;

const load = () => {
  const dir = `${process.env.PUBLIC_URL}/assets/sound`;

  bricks = Array.from({ length: 12 }).map((_, index) => {
    return new Howl({
      src: `${dir}/pling${index + 1}.mp3`,
    });
  });

  paddle = new Howl({
    src: `${dir}/ball-paddle.mp3`
  });
}

const hitBrick = () => {
  if(!settings.brick.sound) return;
  const now = Date.now();
  const diff = now - lastBrickHitTime;
  lastBrickHitIndex++;
  if(diff > 1000) lastBrickHitIndex = 0;
  if(lastBrickHitIndex >= bricks.length) lastBrickHitIndex = bricks.length - 1;
  bricks[lastBrickHitIndex].play();
  lastBrickHitTime = now;
}

const hitPaddle = () => {
  if(!settings.paddle.sound) return;
  paddle.play();
}

export const sound = {
  load,
  brick: hitBrick,
  paddle: hitPaddle,
}