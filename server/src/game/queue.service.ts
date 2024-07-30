import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bullmq';
import {
  PlayerQueuePayload,
  Queues,
  TurnCountdownQueuePayload,
} from 'src/shared/queues';
import { GameGateway } from './game.gateway';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { v4 as uuid } from 'uuid';
import { RedisTemplates } from 'src/shared/redis-templates';
import { Colors, Game } from 'src/shared/common/types/game.type';

@Injectable()
export class QueueService {
  public constructor(
    @InjectQueue(Queues.PLAYER)
    private readonly playerQueue: Queue<PlayerQueuePayload>,
    @InjectQueue(Queues.TURN_COUNTDOWN)
    private readonly turnCountdownQueue: Queue<TurnCountdownQueuePayload>,
    private readonly gameGateway: GameGateway,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  public async startGames() {
    const waitingPlayers = await this.playerQueue.getWaiting();
    console.log(waitingPlayers.length);
    const player1 = waitingPlayers[0];
    const player2 = waitingPlayers[1];

    if (waitingPlayers.length >= 2) {
      const game = new Game();
      game.id = uuid();
      game.player1 = player1.data.connectedSocketId;
      game.player2 = player2.data.connectedSocketId;
      game.playerTurn = player1.data.connectedSocketId;
      game.colorTurn = Colors.YELLOW;

      const turnCountdownJob = await this.turnCountdownQueue.add(
        'TURN_COUNTDOWN',
        {
          gameId: game.id,
        },
        {
          removeOnComplete: true,
          delay: 7000,
        },
      );

      game.turnCountdownJobId = turnCountdownJob.id;

      const [player1GameToken, player2GameToken] = await Promise.all([
        this.jwtService.signAsync({
          playerId: player1.data.connectedSocketId,
          gameId: game.id,
        }),
        this.jwtService.signAsync({
          playerId: player2.data.connectedSocketId,
          gameId: game.id,
        }),
        this.redisService.client.set(
          RedisTemplates.PLAYER_GAME(player1.data.connectedSocketId),
          game.id,
        ),
        this.redisService.client.set(
          RedisTemplates.PLAYER_GAME(player2.data.connectedSocketId),
          game.id,
        ),
        this.redisService.client.hSet(RedisTemplates.GAME(game.id), {
          ...game.serialize(),
        }),
      ]);

      this.gameGateway.gameStarted(
        player1.data.connectedSocketId,
        player2.data.connectedSocketId,
        {
          gameToken: player1GameToken,
          game,
        },
        {
          gameToken: player2GameToken,
          game,
        },
      );
      console.log('game started');

      await Promise.all([
        waitingPlayers[0].remove(),
        waitingPlayers[1].remove(),
      ]);
    }
  }
}
