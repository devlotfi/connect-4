import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Server, Socket } from 'socket.io';
import {
  PlayerQueuePayload,
  Queues,
  TurnCountdownQueuePayload,
} from 'src/shared/queues';
import { JwtService } from '@nestjs/jwt';
import { GameTokenPayload } from 'src/shared/jwt-payload';
import { WsException } from '@nestjs/websockets';
import { RedisService } from 'src/redis/redis.service';
import { RedisTemplates } from 'src/shared/redis-templates';
import { GameStartedMessage } from 'src/shared/common/messages/game-started.message';
import { MakeMoveMessage } from 'src/shared/common/messages/make-move.message';
import { SocketIOMessages } from 'src/shared/common/socket-io-messages';
import { SerializedGame, Game } from 'src/shared/common/types/game.type';

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
    await this.playerQueue.add('PLAYER', payload, {
      jobId: connectedSocket.id,
    });
  }

  public async playerDisconnected(connectedSocket: Socket, server: Server) {
    console.log('player disconnected');
    const gameId = await this.redisService.client.get(
      RedisTemplates.PLAYER_GAME(connectedSocket.id),
    );
    if (!gameId) {
      await this.playerQueue.remove(connectedSocket.id);
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

    server.to(otherPlayer).emit(SocketIOMessages.OPPONENT_DISCONNECTED);

    await this.turnCountdownQueue.remove(serializedGame.turnCountdownJobId);

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

      this.gameUpdated(server, game);
    } catch (error) {
      console.error(error);
    }
  }
}
