import { useContext } from 'react';
import { cn } from '../../utils/cn';
import { OnlineGameContext } from '../../context/online-game.context';
import { Colors } from '../../common/types/colors.type';

interface Props {
  player: 'ME' | 'OPPONENT';
}

export default function PlayerCardOnline({ player: player }: Props) {
  const { socket, game } = useContext(OnlineGameContext);

  if (game) {
    if (player === 'ME') {
      return (
        <div
          className={cn(
            'rounded-lg',
            socket?.id === game.playerTurn &&
              game.colorTurn === Colors.YELLOW &&
              'bg-yellow-200',
            socket?.id === game.playerTurn &&
              game.colorTurn === Colors.RED &&
              'bg-red-200',
          )}
        >
          <div
            className={cn(
              'flex justify-center items-center w-[7rem] lg:w-[10rem] h-[3rem] rounded-lg bg-base-200 translate-y-[-0.3rem]',
              socket?.id === game.playerTurn &&
                game.colorTurn === Colors.YELLOW &&
                'bg-yellow-100 text-color-content',
              socket?.id === game.playerTurn &&
                game.colorTurn === Colors.RED &&
                'bg-red-100 text-color-content',
            )}
          >
            Me
          </div>
        </div>
      );
    } else {
      return (
        <div
          className={cn(
            'rounded-lg',
            socket?.id !== game.playerTurn &&
              game.colorTurn === Colors.YELLOW &&
              'bg-yellow-200',
            socket?.id !== game.playerTurn &&
              game.colorTurn === Colors.RED &&
              'bg-red-200',
          )}
        >
          <div
            className={cn(
              'flex justify-center items-center w-[7rem] lg:w-[10rem] h-[3rem] rounded-lg bg-base-200 translate-y-[-0.3rem]',
              socket?.id !== game.playerTurn &&
                game.colorTurn === Colors.YELLOW &&
                'bg-yellow-100 text-color-content',
              socket?.id !== game.playerTurn &&
                game.colorTurn === Colors.RED &&
                'bg-red-100 text-color-content',
            )}
          >
            Opponent
          </div>
        </div>
      );
    }
  }
}
