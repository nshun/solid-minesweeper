import { Component, Match, Show, Switch } from 'solid-js';
import { useGame } from './Game';

const Dialog: Component = () => {
  const { gameState, createNewGame, setGameState } = useGame();
  const handleClickNewGame = () => createNewGame({});
  const handleClickContine = () => setGameState('InGame');

  return (
    <Show when={gameState() !== 'InGame'}>
      <div class="fixed w-full h-full inset-0 overflow-x-hidden overflow-y-auto bg-gray-600 bg-opacity-50 backdrop-blur-sm">
        <div class="relative m-auto inset-0 top-10 rounded-lg bg-gray-100 max-w-md drop-shadow-xl">
          <div class="p-6 text-center">
            <Switch>
              <Match when={gameState() === 'GameClear'}>
                <h2 class="mb-5 text-lg font-normal text-black">Game Clear!</h2>
                <button class="mx-2 px-2 py-1 outline rounded-md bg-sky-400" onClick={handleClickNewGame}>
                  New Game
                </button>
              </Match>
              <Match when={gameState() === 'GameOver'}>
                <h2 class="mb-5 text-lg font-normal text-black">Game Over!</h2>
                <button class="mx-2 px-2 py-1 outline rounded-md bg-sky-400" onClick={handleClickNewGame}>
                  New Game
                </button>
                <button class="mx-2 px-2 py-1 outline rounded-md bg-slate-200" onClick={handleClickContine}>
                  Continue
                </button>
              </Match>
            </Switch>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default Dialog;
