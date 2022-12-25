import type { Component } from 'solid-js';
import { createSignal, createMemo, Index } from 'solid-js';

const maxGridPixelWidth = 500;

function clampGridSideLength(newSideLength: number): number {
  return Math.min(Math.max(newSideLength, 0), 100);
}

const App: Component = () => {
  const [gridSideLength, setGridSideLength] = createSignal(10);
  const gridTemplateString = createMemo(() => `repeat(${gridSideLength()}, ${maxGridPixelWidth / gridSideLength()}px)`);

  return (
    <>
      <div>
        <label>Grid Side Length: </label>
        <input
          type="number"
          value={gridSideLength()}
          onInput={(e) => setGridSideLength(clampGridSideLength(e.currentTarget.valueAsNumber))}
        />
      </div>

      <div
        style={{
          display: 'grid',
          'grid-template-rows': gridTemplateString(),
          'grid-template-columns': gridTemplateString(),
        }}
        class="m-4 p-0.5 gap-0.5 bg-slate-700 w-fit"
      >
        <Index each={new Array(gridSideLength() ** 2)} fallback={'Input a grid side length.'}>
          {() => (
            <div
              class="cell bg-slate-500"
              onClick={(event) => {
                const el = event.currentTarget;
                el.classList.add('bg-red-200');
              }}
            ></div>
          )}
        </Index>
      </div>
    </>
  );
};

export default App;
