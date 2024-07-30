import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Game } from '../common/types/game.type';
import { SocketIOMessages } from '../common/socket-io-messages';
import { GameStartedMessage } from '../common/messages/game-started.message';

interface OnlineGameContext {
  socket: Socket | null;
  gameToken: string | null;
  game: Game | null;
  stopped: boolean;
}

const initialValue: OnlineGameContext = {
  socket: null,
  gameToken: null,
  game: null,
  stopped: false,
};

export const OnlineGameContext = createContext(initialValue);

export default function OnlineGameProvider({ children }: PropsWithChildren) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameToken, setGameToken] = useState<string | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [stopped, setStopped] = useState<boolean>(false);

  useEffect(() => {
    const createdSocket = io(import.meta.env.VITE_WS_SERVER_URL);
    createdSocket.on(
      SocketIOMessages.GAME_STARTED,
      ({ gameToken, game }: GameStartedMessage) => {
        setGameToken(gameToken);
        setGame(game);
        console.log('game started', game);
      },
    );
    createdSocket.on(SocketIOMessages.GAME_STOPPED, () => {
      setStopped(true);
      console.log('game stopeed');
    });
    createdSocket.on(SocketIOMessages.GAME_UPDATED, (game: Game) => {
      setGame(game);
      console.log('game update');
    });

    setSocket(createdSocket);
    return () => {
      createdSocket.disconnect();
    };
  }, []);

  return (
    <OnlineGameContext.Provider value={{ socket, game, gameToken, stopped }}>
      {children}
    </OnlineGameContext.Provider>
  );
}
