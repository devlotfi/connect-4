import {
  ConnectedSocket,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import { SocketIOMessages } from '../../../common/socket-io-messages';

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  public constructor(private readonly gameService: GameService) {}

  handleConnection(client, ...args: any[]) {
    console.log('connection');
  }

  @SubscribeMessage(SocketIOMessages.JOIN_PLAYER_QUEUE)
  public async joinPlayerQueue(@ConnectedSocket() connectedSocket: Socket) {
    return await this.gameService.joinPlayerQueue({
      connectedSocketId: connectedSocket.id,
    });
  }

  public async gameStarted(
    connectedSocketId1: string,
    connectedSocketId2: string,
    gameId: string,
  ) {
    this.server
      .to([connectedSocketId1, connectedSocketId2])
      .emit(SocketIOMessages.GAME_STARTED, {});
  }
}
