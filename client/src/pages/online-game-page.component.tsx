import { useContext } from 'react';
import { SocketIOContext } from '../context/socket-io.context';
import { SocketIOMessages } from '../../../common/socket-io-messages';

export default function OnlineGamePage() {
  const { socket } = useContext(SocketIOContext);

  return (
    <div className="flex">
      <button
        onClick={() =>
          socket?.emit(SocketIOMessages.JOIN_PLAYER_QUEUE, {}, (data) => {
            console.log(data);
          })
        }
      >
        online
      </button>
    </div>
  );
}
