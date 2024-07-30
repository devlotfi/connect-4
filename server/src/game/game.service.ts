import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Server, Socket } from 'socket.io';
import {
  PlayerQueuePayload,
  Queues,
  TurnCountdownQueuePayload,
} from 'src/shared/queues';
import { GameStartedMessage } from '../../../common/messages/game-started.message';
import { SocketIOMessages } from '../../../common/socket-io-messages';
import { Game, SerializedGame } from '../../../common/types/game.type';
import { MakeMoveMessage } from '../../../common/messages/make-move.message';
import { JwtService } from '@nestjs/jwt';
import { GameTokenPayload } from 'src/shared/jwt-payload';
import { WsException } from '@nestjs/websockets';
import { RedisService } from 'src/redis/redis.service';
import { RedisTemplates } from 'src/shared/redis-templates';

@Injectable()
export class GameService {
  public constructor(
    @InjectQueue(Queues.PLAYER)
    private readonly playerQueue: Queue<PlayerQueuePayload>,
    @InjectQueue(Queues.TURN_COUNTDOWN)
    private readonly turnCountdownQueue: Queue<TurnCountdownQueuePayload>,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  public async joinPlayerQueue(connectedSocket: Socket): Promise<void> {
    const payload: PlayerQueuePayload = {
      connectedSocketId: connectedSocket.id,
    };
    await this.playerQueue.add('PLAYER', payload);
  }

  public async playerDisconnected(connectedSocket: Socket, server: Server) {
    const gameId = await this.redisService.client.get(
      RedisTemplates.PLAYER_GAME(connectedSocket.id),
    );
    if (!gameId) {
      return;
    }

    const serializedGame: SerializedGame =
      (await this.redisService.client.hGetAll(
        RedisTemplates.GAME(gameId),
      )) as any;
    if (!serializedGame) {
      return;
    }

    const otherPlayer =
      serializedGame.player1 === connectedSocket.id
        ? serializedGame.player2
        : serializedGame.player1;

    console.log('player disconencted');

    server.to(otherPlayer).emit(SocketIOMessages.OPPONENT_DISCONNECTED);

    const turnCountdownJob = await this.turnCountdownQueue.getJob(
      serializedGame.turnCountdownJobId,
    );
    if (turnCountdownJob) {
      await turnCountdownJob.moveToCompleted(null, '');
    }
    await this.redisService.client.del([
      RedisTemplates.GAME(serializedGame.id),
      RedisTemplates.PLAYER_GAME(serializedGame.player1),
      RedisTemplates.PLAYER_GAME(serializedGame.player2),
    ]);
  }

  public gameStarted(
    server: Server,
    connectedSocketId1: string,
    connectedSocketId2: string,
    player1Payload: GameStartedMessage,
    player2Payload: GameStartedMessage,
  ): void {
    server
      .to(connectedSocketId1)
      .emit(SocketIOMessages.GAME_STARTED, player1Payload);
    server
      .to(connectedSocketId2)
      .emit(SocketIOMessages.GAME_STARTED, player2Payload);
  }

  public gameStopped(
    server: Server,
    connectedSocketId1: string,
    connectedSocketId2: string,
  ): void {
    server
      .to([connectedSocketId1, connectedSocketId2])
      .emit(SocketIOMessages.GAME_STOPPED);
  }

  public gameUpdated(server: Server, game: Game): void {
    server
      .to([game.player1, game.player2])
      .emit(SocketIOMessages.GAME_UPDATED, game);
  }

  public async makeMove(
    connectedSocket: Socket,
    server: Server,
    makeMoveMessage: MakeMoveMessage,
  ): Promise<void> {
    try {
      const { gameId, playerId } =
        await this.jwtService.verifyAsync<GameTokenPayload>(
          makeMoveMessage.gameToken,
        );

      if (playerId !== connectedSocket.id) {
        throw new WsException('Wrong ID');
      }

      const serializedGame: SerializedGame =
        (await this.redisService.client.hGetAll(
          RedisTemplates.GAME(gameId),
        )) as any;
      if (!serializedGame) {
        throw new WsException('Game not found');
      }

      const game = Game.deserialize(serializedGame);

      if (game.playerTurn !== playerId) {
        throw new WsException('Not your turn');
      }

      const turnCountdownJob = await this.turnCountdownQueue.getJob(
        game.turnCountdownJobId,
      );
      if (turnCountdownJob) {
        await turnCountdownJob.remove();
      }
      const newTurnCountdownJob = await this.turnCountdownQueue.add(
        'TURN_COUNTDOWN',
        {
          gameId: game.id,
        },
        {
          removeOnComplete: true,
          delay: 7000,
        },
      );
      game.turnCountdownJobId = newTurnCountdownJob.id;

      const selectedColmn = game.grid[makeMoveMessage.column];
      for (let i = 0; i < selectedColmn.length; i++) {
        if (selectedColmn[i] === null) {
          selectedColmn[i] = game.colorTurn;
          break;
        }
      }

      await this.redisService.client.hSet(RedisTemplates.GAME(gameId), {
        ...game.serialize(),
      });

      server
        .to([game.player1, game.player2])
        .emit(SocketIOMessages.GAME_UPDATED, game);
    } catch (error) {
      console.error(error);
    }
  }
}
