import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import { GameStartedMessage } from 'src/shared/common/messages/game-started.message';
import { MakeMoveMessage } from 'src/shared/common/messages/make-move.message';
import { SocketIOMessages } from 'src/shared/common/socket-io-messages';
import { Game } from 'src/shared/common/types/game.type';

@WebSocketGateway(5000, {
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  public constructor(private readonly gameService: GameService) {}

  public async handleConnection(connectedSocket: Socket) {
    await this.gameService.joinPlayerQueue(connectedSocket);
  }

  public async handleDisconnect(connectedSocket: Socket) {
    await this.gameService.playerDisconnected(connectedSocket, this.server);
  }

  public gameStarted(
    connectedSocketId1: string,
    connectedSocketId2: string,
    player1Payload: GameStartedMessage,
    player2Payload: GameStartedMessage,
  ) {
    this.gameService.gameStarted(
      this.server,
      connectedSocketId1,
      connectedSocketId2,
      player1Payload,
      player2Payload,
    );
  }

  public gameStopped(connectedSocketId1: string, connectedSocketId2: string) {
    this.gameService.gameStopped(
      this.server,
      connectedSocketId1,
      connectedSocketId2,
    );
  }

  public gameUpdated(game: Game) {
    this.gameService.gameUpdated(this.server, game);
  }

  @SubscribeMessage(SocketIOMessages.MAKE_MOVE)
  public async makeMove(
    @ConnectedSocket() connectedSocket: Socket,
    @MessageBody() makeMoveMessage: MakeMoveMessage,
  ) {
    await this.gameService.makeMove(
      connectedSocket,
      this.server,
      makeMoveMessage,
    );
  }
}
