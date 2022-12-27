import { Component, For, createMemo, onMount } from 'solid-js';
import Cell from './Cell';
import { useGame } from './Game';

const App: Component = () => {
  const { cells, gridSize, createNewGame } = useGame();
  const gridTemplateString = createMemo(() => `repeat(${gridSize()}, 1fr)`);

  onMount(() => createNewGame({}));
  return (
    <div
      style={{ 'grid-template-columns': gridTemplateString() }}
      class="p-0.5 grid gap-0.5 auto-rows-fr bg-slate-700 w-auto max-w-3xl aspect-square select-none"
    >
      <For each={cells()} fallback={'Input a grid side length.'}>
        {(cell) => <Cell cell={cell} />}
      </For>
    </div>
  );
};

export default App;
