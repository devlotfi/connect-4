import { useContext } from 'react';
import { cn } from '../../utils/cn';
import { Colors } from '../../common/types/colors.type';
import { LocalGameContext, PlayerTurn } from '../../context/local-game.context';

interface Props {
  player: PlayerTurn;
}

export default function PlayerCardLocal({ player: player }: Props) {
  const { playerTurn, colorTurn } = useContext(LocalGameContext);

  if (player === 'PLAYER_1') {
    return (
      <div
        className={cn(
          'rounded-lg',
          playerTurn === 'PLAYER_1' &&
            colorTurn === Colors.YELLOW &&
            'bg-yellow-200',
          playerTurn === 'PLAYER_1' && colorTurn === Colors.RED && 'bg-red-200',
        )}
      >
        <div
          className={cn(
            'flex justify-center items-center w-[7rem] lg:w-[10rem] h-[3rem] rounded-lg bg-base-200 translate-y-[-0.3rem]',
            playerTurn === 'PLAYER_1' &&
              colorTurn === Colors.YELLOW &&
              'bg-yellow-100 text-color-content',
            playerTurn === 'PLAYER_1' &&
              colorTurn === Colors.RED &&
              'bg-red-100 text-color-content',
          )}
        >
          Player 1
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={cn(
          'rounded-lg',
          playerTurn === 'PLAYER_2' &&
            colorTurn === Colors.YELLOW &&
            'bg-yellow-200',
          playerTurn === 'PLAYER_2' && colorTurn === Colors.RED && 'bg-red-200',
        )}
      >
        <div
          className={cn(
            'flex justify-center items-center w-[7rem] lg:w-[10rem] h-[3rem] rounded-lg bg-base-200 translate-y-[-0.3rem]',
            playerTurn === 'PLAYER_2' &&
              colorTurn === Colors.YELLOW &&
              'bg-yellow-100 text-color-content',
            playerTurn === 'PLAYER_2' &&
              colorTurn === Colors.RED &&
              'bg-red-100 text-color-content',
          )}
        >
          Player 2
        </div>
      </div>
    );
  }
}
