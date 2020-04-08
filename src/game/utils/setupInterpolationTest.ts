import { Ease } from "./Ease";
import { setInterpolation } from "./setInterpolation";

export const setupInterpolationTest = () => {
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.width = '30px';
  div.style.height = '30px';
  div.style.backgroundColor = 'red';
  div.style.top = '100px';
  document.body.appendChild(div);
  setInterpolation({
    frames: [
      { value: 0 },
      { value: 200 },
      { value: 50 },
      { value: window.innerWidth }
    ],
    duration: 3000,
    easingFunction: Ease.inOut(2),
    onChange: (n) => (div.style.left = n + 'px')
  });
}