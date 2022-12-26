import { Component, createEffect, For, createSignal, createMemo } from 'solid-js';
import Cell, { GridCell } from './components/Cell';
import shuffle from './libs/shuffle';

const isLeftEndCell = (i: number, size: number) => i % size === 0;
const isRightEndCell = (i: number, size: number) => (i + 1) % size === 0;
const isTopEndCell = (i: number, size: number) => i - size < 0;
const isBottomEndCell = (i: number, size: number) => i + size >= size ** 2;

type Action = 'Open' | 'Check';

const App: Component = () => {
  const [gridSideLength, setGridSideLength] = createSignal(30);
  const [bombRate, setBombRate] = createSignal(20);
  const [action, setAction] = createSignal<Action>('Open');
  const [cells, setCells] = createSignal<GridCell[]>([]);
  const gridTemplateString = createMemo(() => `repeat(${gridSideLength()}, 1fr)`);

  const createOnClickHandler = (i: number) => () => {
    const cell = cells()[i];
    if (action() === 'Check') {
      cell.toggleLock();
      return;
    }

    if (cell.isLock()) return;
    cell.setIsOpen(true);
    if (!cell.isBomb && cell.numberOfNearbyBombs === 0) {
      const size = gridSideLength();
      const check = (j: number) => !cells()[j].isBomb && !cells()[j].isOpen();
      if (!isLeftEndCell(i, size) && check(i - 1)) cells()[i - 1].onClick();
      if (!isRightEndCell(i, size) && check(i + 1)) cells()[i + 1].onClick();
      if (!isTopEndCell(i, size) && check(i - size)) cells()[i - size].onClick();
      if (!isBottomEndCell(i, size) && check(i + size)) cells()[i + size].onClick();
      if (!isRightEndCell(i, size) && !isTopEndCell(i, size) && check(i - size + 1)) cells()[i - size + 1].onClick();
      if (!isRightEndCell(i, size) && !isBottomEndCell(i, size) && check(i + size + 1)) cells()[i + size + 1].onClick();
      if (!isLeftEndCell(i, size) && !isTopEndCell(i, size) && check(i - size - 1)) cells()[i - size - 1].onClick();
      if (!isLeftEndCell(i, size) && !isBottomEndCell(i, size) && check(i + size - 1)) cells()[i + size - 1].onClick();
    }
  };

  createEffect(() => {
    const size = gridSideLength();
    const rate = bombRate();
    const cellNums = size ** 2;
    let cells: GridCell[] = Array.from({ length: cellNums }, (_, i) => {
      const [isOpen, setIsOpen] = createSignal(false);
      const [isLock, setIsLock] = createSignal(false);
      return {
        isBomb: i < cellNums * (rate / 100),
        numberOfNearbyBombs: 0,
        isOpen,
        setIsOpen,
        onClick: () => {},
        isLock,
        toggleLock: () => setIsLock(!isLock()),
      };
    });
    cells = shuffle(cells);
    cells = cells.map((cell, i) => {
      if (cell.isBomb) {
        if (!isLeftEndCell(i, size)) cells[i - 1].numberOfNearbyBombs++;
        if (!isRightEndCell(i, size)) cells[i + 1].numberOfNearbyBombs++;
        if (!isTopEndCell(i, size)) cells[i - size].numberOfNearbyBombs++;
        if (!isBottomEndCell(i, size)) cells[i + size].numberOfNearbyBombs++;
        if (!isRightEndCell(i, size) && !isTopEndCell(i, size)) cells[i - size + 1].numberOfNearbyBombs++;
        if (!isRightEndCell(i, size) && !isBottomEndCell(i, size)) cells[i + size + 1].numberOfNearbyBombs++;
        if (!isLeftEndCell(i, size) && !isTopEndCell(i, size)) cells[i - size - 1].numberOfNearbyBombs++;
        if (!isLeftEndCell(i, size) && !isBottomEndCell(i, size)) cells[i + size - 1].numberOfNearbyBombs++;
      }
      cell.onClick = createOnClickHandler(i);
      return cell;
    });
    setCells(cells);
  });

  return (
    <div class="container mx-auto">
      <div class="flex my-3 text-xl space-x-4">
        <label>
          <span>Game Side Length:</span>
          <select value={gridSideLength()} onInput={(e) => setGridSideLength(Number(e.currentTarget.value))}>
            <For each={[20, 30, 40, 50, 60]}>{(num) => <option value={num}>{num}</option>}</For>
          </select>
        </label>
        <label>
          <span>Bomb Rate: </span>
          <select value={bombRate()} onInput={(e) => setBombRate(Number(e.currentTarget.value))}>
            <For each={[10, 15, 20, 25, 30]}>{(num) => <option value={num}>{num} %</option>}</For>
          </select>
        </label>
        <label>
          <span>Action: </span>
          <For each={['Open', 'Check']}>
            {(a) => (
              <button
                onClick={() => setAction(a as Action)}
                class={`mx-2 px-1 outline rounded-lg ${a === action() ? 'bg-pink-500' : 'bg-slate-200'}`}
              >
                {a}
              </button>
            )}
          </For>
        </label>
      </div>

      <div
        style={{ 'grid-template-columns': gridTemplateString() }}
        class="p-0.5 grid gap-0.5 auto-rows-fr bg-slate-700 w-auto max-w-3xl aspect-square"
      >
        <For each={cells()} fallback={'Input a grid side length.'}>
          {(cell) => <Cell cell={cell} />}
        </For>
      </div>
    </div>
  );
};

export default App;
