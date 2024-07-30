import { useContext } from 'react';
import { OnlineGameContext } from '../context/online-game.context';
import { SocketIOMessages } from '../common/socket-io-messages';

export default function OnlineGamePage() {
  const { socket } = useContext(OnlineGameContext);

  return (
    <div className="flex">
      <button
        onClick={() =>
          socket?.emit(
            SocketIOMessages.MAKE_MOVE,
            {
              gameToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6ImFUVV9CbXZTYkFxUHdCdXVBQUFDIiwiZ2FtZUlkIjoiOTEzNDY1YWEtNGQ4Yy00M2I3LWJmYjctYTYwYzMzZWYxY2E1IiwiaWF0IjoxNzIyMzQ2MzgwLCJleHAiOjE3MjIzNDk5ODB9.oeI6Vammx-b3WZHMFEC3LaPQB71MwluEiXKtsjB6Omw',
            },
            (data: string) => {
              console.log(data);
            },
          )
        }
      >
        online
      </button>
    </div>
  );
}
