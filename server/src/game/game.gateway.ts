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
import { SocketIOMessages } from '../../../common/socket-io-messages';
import { GameStartedMessage } from '../../../common/messages/game-started.message';
import { Game } from '../../../common/types/game.type';
import { UseGuards } from '@nestjs/common';
import { GameGuard } from 'src/shared/guards/auth.guard';
import { MakeMoveMessage } from '../../../common/messages/make-move.message';

@WebSocketGateway({ cors: true })
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
  @UseGuards(GameGuard)
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
