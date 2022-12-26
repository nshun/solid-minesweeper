import { Component, createEffect, For, createSignal, createMemo } from 'solid-js';
import Cell, { GridCell } from './components/Cell';
import shuffle from './libs/shuffle';

const isLeftEndCell = (i: number, size: number) => i % size === 0;
const isRightEndCell = (i: number, size: number) => (i + 1) % size === 0;
const isTopEndCell = (i: number, size: number) => i - size < 0;
const isBottomEndCell = (i: number, size: number) => i + size >= size ** 2;

const App: Component = () => {
  const [gridSideLength, setGridSideLength] = createSignal(20);
  const [bombRate, setBombRate] = createSignal(20);
  const [cells, setCells] = createSignal<GridCell[]>([]);
  const gridTemplateString = createMemo(() => `repeat(${gridSideLength()}, 1fr)`);

  const createOpenCallback = (i: number) => () => {
    const cell = cells()[i];
    cell.setIsOpen(true);

    if (!cell.isBomb && cell.numberOfNearbyBombs === 0) {
      const size = gridSideLength();
      const check = (j: number) => !cells()[j].isBomb && !cells()[j].isOpen();
      if (!isLeftEndCell(i, size) && check(i - 1)) cells()[i - 1].open();
      if (!isRightEndCell(i, size) && check(i + 1)) cells()[i + 1].open();
      if (!isTopEndCell(i, size) && check(i - size)) cells()[i - size].open();
      if (!isBottomEndCell(i, size) && check(i + size)) cells()[i + size].open();
      if (!isRightEndCell(i, size) && !isTopEndCell(i, size) && check(i - size + 1)) cells()[i - size + 1].open();
      if (!isRightEndCell(i, size) && !isBottomEndCell(i, size) && check(i + size + 1)) cells()[i + size + 1].open();
      if (!isLeftEndCell(i, size) && !isTopEndCell(i, size) && check(i - size - 1)) cells()[i - size - 1].open();
      if (!isLeftEndCell(i, size) && !isBottomEndCell(i, size) && check(i + size - 1)) cells()[i + size - 1].open();
    }
  };

  createEffect(() => {
    console.log('aaa');
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
        open: () => {},
        isLock,
        toggleLock: () => setIsLock(!isLock),
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
      cell.open = createOpenCallback(i);
      return cell;
    });
    setCells(cells);
  });

  return (
    <div class="container mx-auto">
      <div class="my-3 text-xl space-x-8">
        <span>
          <label>Game Side Length: </label>
          <select value={gridSideLength()} onInput={(e) => setGridSideLength(Number(e.currentTarget.value))}>
            <For each={[10, 20, 40, 60]}>{(num) => <option value={num}>{num}</option>}</For>
          </select>
        </span>
        <span>
          <label>Bomb Rate: </label>
          <select value={bombRate()} onInput={(e) => setBombRate(Number(e.currentTarget.value))}>
            <For each={[10, 15, 20, 25, 30]}>{(num) => <option value={num}>{num} %</option>}</For>
          </select>
        </span>
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
