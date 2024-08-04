import { useContext } from 'react';
import PlayerCardLocal from '../components/player-card/player-card-local.component';
import { LocalGameContext } from '../context/local-game.context';
import { Colors } from '../common/types/colors.type';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Tile from '../components/tile/tile.component';

export default function LocalGamePage() {
  const { timer, grid, makeMove } = useContext(LocalGameContext);

  const isColumnFull = (column: Array<Colors | null>): boolean => {
    for (const tile of column) {
      if (tile === null) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex flex-col">
        <div className="flex justify-between items-center py-[1rem]">
          <PlayerCardLocal player="PLAYER_1"></PlayerCardLocal>
          <div className="flex">{timer} s</div>
          <PlayerCardLocal player="PLAYER_2"></PlayerCardLocal>
        </div>
        <div className="flex justify-center">
          <div className="flex mt-[5rem] p-[0.7rem] bg-game-grid rounded-3xl space-x-3">
            {grid.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className="flex flex-col-reverse items-center relative"
              >
                {!isColumnFull(column) ? (
                  <FontAwesomeIcon
                    className="absolute top-[-4.3rem] lg:top-[-5rem] text-[30pt] lg:text-[50pt] text-base-content hover:translate-y-[0.3rem] duration-300 cursor-pointer"
                    icon={faCaretDown}
                    onClick={() => makeMove(columnIndex)}
                  ></FontAwesomeIcon>
                ) : null}
                <div className="flex flex-col-reverse space-y-3 space-y-reverse">
                  {column.map((slot, tileIndex) => (
                    <Tile key={tileIndex} content={slot}></Tile>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
