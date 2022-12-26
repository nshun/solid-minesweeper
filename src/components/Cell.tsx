import { Accessor, Component, Match, Setter, Switch } from 'solid-js';

export interface GridCell {
  isBomb: boolean;
  numberOfNearbyBombs: number;
  isOpen: Accessor<boolean>;
  setIsOpen: Setter<boolean>;
  onClick: () => void;
  isLock: Accessor<boolean>;
  toggleLock: () => void;
}

const cellBackground = (cell: GridCell) => {
  if (cell.isOpen()) {
    return cell.isBomb ? 'bg-pink-400' : 'bg-slate-400';
  }
  if (cell.isLock()) {
    return 'bg-orange-300';
  }
  return 'bg-slate-500';
};

interface CellProps {
  cell: GridCell;
}

const Cell: Component<CellProps> = ({ cell }) => {
  return (
    <div
      class={`cell ${cellBackground(
        cell
      )} hover:outline outline-cyan-500 w-full h-full flex justify-center items-center`}
      onClick={cell.onClick}
    >
      <Switch>
        <Match when={cell.isLock()}>
          <b>!</b>
        </Match>
        <Match when={cell.isOpen() && cell.isBomb}>×</Match>
        <Match when={cell.isOpen() && cell.numberOfNearbyBombs > 0}>
          <span class="text-xl">{cell.numberOfNearbyBombs}</span>
        </Match>
      </Switch>
    </div>
  );
};

export default Cell;
