import * as PIXI from 'pixi.js';

export const initGame = (elem: HTMLElement) => {
  
  let app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });

  elem.append(app.view)

  return app;
}