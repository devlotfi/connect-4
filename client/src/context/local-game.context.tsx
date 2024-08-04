import {
  createContext,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';
import PlayerWinModal from '../components/modals/player-win-modal.component';
import GameStoppedModal from '../components/modals/game-stopped-modal.component';
import { Colors } from '../common/types/colors.type';

type Grid = Array<Array<Colors | null>>;
export type PlayerTurn = 'PLAYER_1' | 'PLAYER_2';

interface LocalGameContext {
  grid: Grid;
  playerTurn: PlayerTurn;
  colorTurn: Colors;
  timer: number;
  makeMove: (columnIndex: number) => void;
}

const initialValue: LocalGameContext = {
  grid: Array(7)
    .fill(null)
    .map(() => Array(6).fill(null)),
  playerTurn: 'PLAYER_1',
  colorTurn: Colors.RED,
  timer: 7,
  makeMove() {},
};

export const LocalGameContext = createContext(initialValue);

export default function LocalGameProvider({ children }: PropsWithChildren) {
  const timerIntervalRef = useRef<ReturnType<typeof setTimeout>>();
  const [playerTurn, setPlayerTurn] = useState<'PLAYER_1' | 'PLAYER_2'>(
    initialValue.playerTurn,
  );
  const [colorTurn, setColorTurn] = useState<Colors>(initialValue.colorTurn);
  const [grid, setGrid] = useState<Array<Array<Colors | null>>>(
    initialValue.grid,
  );
  const [timer, setTimer] = useState<number>(initialValue.timer);

  const playerWinModalRef = useRef<HTMLDialogElement>(null);
  const gameStoppedModalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    timerIntervalRef.current = setInterval(() => {
      setTimer((timer) => {
        if (timer > 0) {
          return timer - 1;
        } else {
          clearInterval(timerIntervalRef.current);
          gameStoppedModalRef.current?.showModal();
          return timer;
        }
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const makeMove = (columnIndex: number) => {
    setGrid((grid) => {
      const newGrid = [...grid];
      newGrid[columnIndex] = [...grid[columnIndex]];
      const column = newGrid[columnIndex];

      for (let i = 0; i < column.length; i++) {
        if (column[i] === null) {
          column[i] = colorTurn;

          if (checkForWin(newGrid)) {
            playerWinModalRef.current?.showModal();
            clearInterval(timerIntervalRef.current);
            return newGrid;
          }
          setColorTurn(colorTurn === Colors.RED ? Colors.YELLOW : Colors.RED);
          setPlayerTurn(playerTurn === 'PLAYER_1' ? 'PLAYER_2' : 'PLAYER_1');

          break;
        }
      }

      return newGrid;
    });
    setTimer(7);
  };

  const checkForWin = (grid: Grid): boolean => {
    const cols = grid.length;
    const rows = grid[0].length;

    // Check horizontal win
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row <= rows - 4; row++) {
        if (
          grid[col][row] &&
          grid[col][row] === grid[col][row + 1] &&
          grid[col][row] === grid[col][row + 2] &&
          grid[col][row] === grid[col][row + 3]
        ) {
          return true;
        }
      }
    }

    // Check vertical win
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col <= cols - 4; col++) {
        if (
          grid[col][row] &&
          grid[col][row] === grid[col + 1][row] &&
          grid[col][row] === grid[col + 2][row] &&
          grid[col][row] === grid[col + 3][row]
        ) {
          return true;
        }
      }
    }

    // Check diagonal (bottom-left to top-right) win
    for (let col = 3; col < cols; col++) {
      for (let row = 0; row <= rows - 4; row++) {
        if (
          grid[col][row] &&
          grid[col][row] === grid[col - 1][row + 1] &&
          grid[col][row] === grid[col - 2][row + 2] &&
          grid[col][row] === grid[col - 3][row + 3]
        ) {
          return true;
        }
      }
    }

    // Check diagonal (top-left to bottom-right) win
    for (let col = 0; col <= cols - 4; col++) {
      for (let row = 0; row <= rows - 4; row++) {
        if (
          grid[col][row] &&
          grid[col][row] === grid[col + 1][row + 1] &&
          grid[col][row] === grid[col + 2][row + 2] &&
          grid[col][row] === grid[col + 3][row + 3]
        ) {
          return true;
        }
      }
    }

    return false;
  };

  return (
    <LocalGameContext.Provider
      value={{ playerTurn, colorTurn, grid, makeMove, timer }}
    >
      <PlayerWinModal
        player={playerTurn === 'PLAYER_1' ? 'Player 1 ' : 'Player 2'}
        modalRef={playerWinModalRef}
      ></PlayerWinModal>
      <GameStoppedModal modalRef={gameStoppedModalRef}></GameStoppedModal>
      {children}
    </LocalGameContext.Provider>
  );
}
