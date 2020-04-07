import { Howl } from "howler";
import { settings } from "./settings";

let music: Howl;
let wall: Howl;
let paddle: Howl;
let bricks: Howl[];

let lastBrickHitTime = 0;
let lastBrickHitIndex = 0;


const load = () => {
  const dir = `${process.env.PUBLIC_URL}/assets/sound`;

  bricks = Array.from({ length: 12 }).map((_, index) => {
    return new Howl({
      src: `${dir}/pling${index + 1}.mp3`
    });
  });

  paddle = new Howl({
    src: `${dir}/ball-paddle.mp3`
  });

  wall = new Howl({
    src: `${dir}/ball-wall.mp3`
  });

  music = new Howl({
    src: `${dir}/juicy_breakout-theme.mp3`,
    autoplay: settings.general.music,
    loop: true,
    volume: .3,
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

const hitWall = () => {
  if(!settings.wall.sound) return;
  wall.play();
}

export const sound = {
  load,
  brick: hitBrick,
  paddle: hitPaddle,
  wall: hitWall,
}