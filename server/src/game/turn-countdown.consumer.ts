import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { RedisService } from 'src/redis/redis.service';
import { Queues, TurnCountdownQueuePayload } from 'src/shared/queues';
import { RedisTemplates } from 'src/shared/redis-templates';
import { SerializedGame } from '../../../common/types/game.type';
import { GameGateway } from './game.gateway';

@Processor(Queues.TURN_COUNTDOWN)
export class TurnCountdownConsumer extends WorkerHost {
  public constructor(
    private readonly redisService: RedisService,
    private readonly gameGateway: GameGateway,
  ) {
    super();
  }

  public async process(job: Job<TurnCountdownQueuePayload>) {
    console.log('game stopped');
    const serializedGame: SerializedGame =
      (await this.redisService.client.hGetAll(
        RedisTemplates.GAME(job.data.gameId),
      )) as any;

    await this.redisService.client.del([
      RedisTemplates.GAME(serializedGame.id),
      RedisTemplates.PLAYER_GAME(serializedGame.player1),
      RedisTemplates.PLAYER_GAME(serializedGame.player2),
    ]);

    this.gameGateway.gameStopped(
      serializedGame.player1,
      serializedGame.player2,
    );
  }
}
