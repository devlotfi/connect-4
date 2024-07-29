import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketIOMessages } from '../../../common/socket-io-messages';

interface SocketIOContext {
  socket: Socket | null;
}

const initialValue: SocketIOContext = {
  socket: null,
};

export const SocketIOContext = createContext(initialValue);

export default function SocketIOProvider({ children }: PropsWithChildren) {
  const [socket, setSocket] = useState<Socket>(null);

  useEffect(() => {
    const createdSocket = io(import.meta.env.VITE_WS_SERVER_URL);
    createdSocket.on(SocketIOMessages.GAME_STARTED, () => {
      console.log('game started');
    });

    setSocket(createdSocket);
    return () => {
      createdSocket.disconnect();
    };
  }, []);

  return (
    <SocketIOContext.Provider value={{ socket }}>
      {children}
    </SocketIOContext.Provider>
  );
}
