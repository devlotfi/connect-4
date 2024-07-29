import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Queues } from 'src/shared/queues';
import { JoinPlayerQueueMessage } from '../../../common/messages/join-player-queue.message';

@Injectable()
export class GameService {
  public constructor(
    @InjectQueue(Queues.PLAYER)
    private readonly playerQueue: Queue<JoinPlayerQueueMessage>,
  ) {}

  public async joinPlayerQueue(
    payload: JoinPlayerQueueMessage,
  ): Promise<boolean> {
    await this.playerQueue.add('PLAYER', payload);
    return true;
  }
}
