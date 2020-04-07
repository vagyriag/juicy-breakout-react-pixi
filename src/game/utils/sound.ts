import { Howl } from "howler";
import { settings } from "./settings";

const bricks: Howl[] = Array.from({ length: 12 });
let lastBrickHitTime = 0;
let lastBrickHitIndex = 0;

const load = () => {
  bricks.forEach((_, index) => {
    const s = new Howl({
      src: `${process.env.PUBLIC_URL}/assets/sound/pling${index + 1}.mp3`,
    });
    bricks[index] = s;
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

export const sound = {
  load,
  hitBrick,
}