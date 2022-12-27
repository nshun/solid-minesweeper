import {
  createSignal,
  createContext,
  ParentComponent,
  batch,
  useContext,
  Accessor,
  Setter,
  createEffect,
} from 'solid-js';
import { GridCell } from './Cell';
import shuffle from '../libs/shuffle';

export type Action = 'Open' | 'Lock';
export type GameState = 'InGame' | 'GameOver' | 'GameClear';
interface XY {
  x: number;
  y: number;
}

interface CreateNewGameProps {
  size?: number;
  rate?: number;
}

interface Game {
  gameState: Accessor<GameState>;
  setGameState: Setter<GameState>;
  cells: Accessor<GridCell[]>;
  gridSize: Accessor<number>;
  bombRate: Accessor<number>;
  action: Accessor<Action>;
  setAction: Setter<Action>;
  createNewGame: (props: CreateNewGameProps) => void;
}

const GameContext = createContext<Game>();

const index2xy = (i: number, gridSize: number): XY => {
  const y = Math.floor(i / gridSize);
  const x = i - y * gridSize;
  return { x, y };
};

const xy2index = (xy: XY, gridSize: number): number => {
  const i = xy.x + xy.y * gridSize;
  return i;
};

const isInsideFromXY = (i: number, delta: XY, gridSize: number) => {
  const current = index2xy(i, gridSize);
  const target = { x: current.x + delta.x, y: current.y + delta.y };
  if (target.x < 0 || target.x >= gridSize) return false;
  if (target.y < 0 || target.y >= gridSize) return false;
  return xy2index(target, gridSize);
};

const aroundDeltas: XY[] = [
  { x: -1, y: -1 },
  { x: -1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
];

const GameProvider: ParentComponent = (props) => {
  const [gridSize, setGridSize] = createSignal(30);
  const [bombRate, setBombRate] = createSignal(20);
  const [gameState, setGameState] = createSignal<GameState>('InGame');
  const [action, setAction] = createSignal<Action>('Open');
  const [cells, setCells] = createSignal<GridCell[]>([]);

  createEffect(() => {
    console.log(gameState());
  });

  const createOnClickHandler = (i: number) => () => {
    const cell = cells()[i];

    // Toggle lock state
    if (action() === 'Lock') {
      cell.toggleLock();
      return;
    }

    // Open self & around cells
    if (cell.isLock()) return;
    cell.setIsOpen(true);
    if (!cell.isBomb && cell.numberOfNearbyBombs === 0) {
      const check = (j: number) => !cells()[j].isBomb && !cells()[j].isOpen();
      for (const delta of aroundDeltas) {
        const target = isInsideFromXY(i, delta, gridSize());
        if (target !== false && check(target)) cells()[target].onClick();
      }
    }

    // Update game state
    if (cell.isBomb) setGameState('GameOver');
    else if (cells().filter((cell) => !cell.isBomb && !cell.isOpen()).length === 0) setGameState('GameClear');
  };

  const createNewGame = ({ size = gridSize(), rate = bombRate() }: CreateNewGameProps) => {
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
        for (const delta of aroundDeltas) {
          const target = isInsideFromXY(i, delta, size);
          if (target !== false) cells[target].numberOfNearbyBombs++;
        }
      }
      cell.onClick = createOnClickHandler(i);
      return cell;
    });

    batch(() => {
      setGameState('InGame');
      setGridSize(size);
      setBombRate(rate);
      setCells(cells);
    });
  };

  const store = {
    gameState,
    setGameState,
    cells,
    gridSize,
    bombRate,
    action,
    setAction,
    createNewGame,
  };

  return <GameContext.Provider value={store}>{props.children}</GameContext.Provider>;
};

export const useGame = () => useContext(GameContext)!;
export default GameProvider;
