import { useContext } from 'react';
import { OnlineGameContext } from '../context/online-game.context';
import Loader from '../components/loader/loader.component';
import PlayerCardOnline from '../components/player-card/player-card-online.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { SocketIOMessages } from '../common/socket-io-messages';
import { MakeMoveMessage } from '../common/messages/make-move.message';
import Tile from '../components/tile/tile.component';
import { Colors } from '../common/types/colors.type';

export default function OnlineGamePage() {
  const { socket, game, gameToken, timer } = useContext(OnlineGameContext);

  if (!game || !gameToken) {
    return (
      <div className="flex flex-1 flex-col justify-center items-center">
        <div className="flex flex-col items-center space-y-5">
          <div className="flex text-[30pt] text-center px-[1rem]">
            Waiting for players
          </div>
          <Loader></Loader>
        </div>
      </div>
    );
  }

  const makeMove = (columnIndex: number) => {
    const payload: MakeMoveMessage = {
      column: columnIndex,
      gameToken: gameToken,
    };

    socket?.emit(SocketIOMessages.MAKE_MOVE, payload);
  };

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
          <PlayerCardOnline player="ME"></PlayerCardOnline>
          <div className="flex">{timer} s</div>
          <PlayerCardOnline player="OPPONENT"></PlayerCardOnline>
        </div>
        <div className="flex justify-center">
          <div className="flex mt-[5rem] p-[0.7rem] bg-game-grid rounded-3xl space-x-3">
            {game.grid.map((column, columnIndex) => (
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
