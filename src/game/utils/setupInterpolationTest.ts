import { Ease } from "./Ease";
import { interpolation } from "./interpolation";

export const setupInterpolationTest = () => {
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.width = '30px';
  div.style.height = '30px';
  div.style.backgroundColor = 'red';
  div.style.top = '100px';
  document.body.appendChild(div);
  interpolation({
    frames: [
      { n: 0 },
      { n: 200 },
      { n: 50 },
      { n: window.innerWidth }
    ],
    duration: 3000,
    easingFunction: Ease.inOut(2),
    onChange: (n) => (div.style.left = n + 'px')
  });
}