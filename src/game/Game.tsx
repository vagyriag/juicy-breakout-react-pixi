import * as React from 'react';
import { initGame } from './main';
import { Application } from 'pixi.js';

interface GameProps {}

const Game: React.FC<GameProps> = () => {

  const divRef = React.useRef(null);
  const gameRef = React.useRef(null as null|Application);

  React.useEffect(() => {
    gameRef.current = initGame(divRef.current!);
  }, []);
  
  return (<div ref={divRef}></div>);
}

export default Game;