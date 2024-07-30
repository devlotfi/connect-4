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
    createdSocket.on(SocketIOMessages.GAME_STARTED, (data) => {
      console.log('game started', data);
    });
    createdSocket.on(SocketIOMessages.GAME_STOPPED, (data) => {
      console.log('game stopeed', data);
    });
    createdSocket.on(SocketIOMessages.GAME_UPDATED, (data) => {
      console.log('game update', data);
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
