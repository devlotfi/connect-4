import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bullmq';
import { Queues } from 'src/shared/queues';
import { JoinPlayerQueueMessage } from '../../../common/messages/join-player-queue.message';
import { GameGateway } from './game.gateway';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class QueueService {
  public constructor(
    @InjectQueue(Queues.PLAYER)
    private readonly playerQueue: Queue<JoinPlayerQueueMessage>,
    private readonly gameGateway: GameGateway,
    private readonly jwtService: JwtService,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  public async startGames() {
    const waitingPlayers = await this.playerQueue.getWaiting();
    console.log(waitingPlayers.length);

    if (waitingPlayers.length >= 2) {
      this.gameGateway.gameStarted(
        waitingPlayers[0].data.connectedSocketId,
        waitingPlayers[1].data.connectedSocketId,
        '',
      );

      await Promise.all([
        waitingPlayers[0].remove(),
        waitingPlayers[1].remove(),
      ]);
    }
  }
}
