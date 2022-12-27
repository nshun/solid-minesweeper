import { Component, For } from 'solid-js';
import { Action, useGame } from './Game';

const Nav: Component = () => {
  const { gridSize, bombRate, action, createNewGame, setAction } = useGame();

  return (
    <div class="flex my-3 text-xl space-x-4">
      <label>
        <span>Game Size:</span>
        <select value={gridSize()} onInput={(e) => createNewGame({ size: Number(e.currentTarget.value) })}>
          <For each={[10, 20, 30, 40, 50]}>
            {(num) => (
              <option value={num}>
                {num}×{num}
              </option>
            )}
          </For>
        </select>
      </label>
      <label>
        <span>Bomb Rate: </span>
        <select value={bombRate()} onInput={(e) => createNewGame({ rate: Number(e.currentTarget.value) })}>
          <For each={[10, 15, 20, 25, 30]}>{(num) => <option value={num}>{num} %</option>}</For>
        </select>
      </label>
      <label>
        <span>Action: </span>
        <For each={['Open', 'Lock'] as Action[]}>
          {(a) => (
            <button
              onClick={() => setAction(a)}
              class={`mx-2 px-1 outline rounded-lg ${a === action() ? 'bg-pink-500' : 'bg-slate-200'}`}
            >
              {a}
            </button>
          )}
        </For>
      </label>
    </div>
  );
};

export default Nav;
