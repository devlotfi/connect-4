import {
  createContext,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { Game } from '../common/types/game.type';
import { SocketIOMessages } from '../common/socket-io-messages';
import { GameStartedMessage } from '../common/messages/game-started.message';
import PlayerWinModal from '../components/modals/player-win-modal.component';
import PlayerLossModal from '../components/modals/player-loss-modal.component';
import GameStoppedModal from '../components/modals/game-stopped-modal.component';
import OpponentDisconnectedModal from '../components/modals/opponent-disconnected-modal.component';

interface OnlineGameContext {
  socket: Socket | null;
  gameToken: string | null;
  game: Game | null;
  timer: number;
}

const initialValue: OnlineGameContext = {
  socket: null,
  gameToken: null,
  game: null,
  timer: 7,
};

export const OnlineGameContext = createContext(initialValue);

export default function OnlineGameProvider({ children }: PropsWithChildren) {
  const timerIntervalRef = useRef<ReturnType<typeof setTimeout>>();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameToken, setGameToken] = useState<string | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [timer, setTimer] = useState<number>(7);

  const playerWinModalRef = useRef<HTMLDialogElement>(null);
  const playerLossModalRef = useRef<HTMLDialogElement>(null);
  const gameStoppedModalRef = useRef<HTMLDialogElement>(null);
  const opponentDisconnectedModalRef = useRef<HTMLDialogElement>(null);

  useEffect(
    () => () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    },
    [],
  );

  const startTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    setTimer(7);
    timerIntervalRef.current = setInterval(() => {
      setTimer((timer) => {
        if (timer > 0) {
          return timer - 1;
        } else {
          clearInterval(timerIntervalRef.current);
          return timer;
        }
      });
    }, 1000);
  };

  useEffect(() => {
    const createdSocket = io(import.meta.env.VITE_WS_SERVER_URL, {
      transports: ['websocket'],
    });
    createdSocket.on(
      SocketIOMessages.GAME_STARTED,
      ({ gameToken, game }: GameStartedMessage) => {
        setGameToken(gameToken);
        setGame(game);
        startTimer();
        console.log('game started', game);
      },
    );
    createdSocket.on(SocketIOMessages.GAME_STOPPED, () => {
      gameStoppedModalRef.current?.showModal();
    });
    createdSocket.on(SocketIOMessages.GAME_UPDATED, (game: Game) => {
      setGame(game);
      startTimer();
      console.log(game);

      console.log('game update');
    });

    createdSocket.on(SocketIOMessages.PLAYER_WIN, () => {
      playerWinModalRef.current?.showModal();
    });

    createdSocket.on(SocketIOMessages.PLAYER_LOSS, () => {
      playerLossModalRef.current?.showModal();
    });

    createdSocket.on(SocketIOMessages.OPPONENT_DISCONNECTED, () => {
      opponentDisconnectedModalRef.current?.showModal();
    });

    setSocket(createdSocket);
    return () => {
      createdSocket.disconnect();
    };
  }, []);

  return (
    <OnlineGameContext.Provider value={{ socket, game, gameToken, timer }}>
      <PlayerWinModal modalRef={playerWinModalRef}></PlayerWinModal>
      <PlayerLossModal modalRef={playerLossModalRef}></PlayerLossModal>
      <GameStoppedModal modalRef={gameStoppedModalRef}></GameStoppedModal>
      <OpponentDisconnectedModal
        modalRef={opponentDisconnectedModalRef}
      ></OpponentDisconnectedModal>
      {children}
    </OnlineGameContext.Provider>
  );
}
