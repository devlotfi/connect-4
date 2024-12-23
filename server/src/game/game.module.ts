import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { RedisModule } from 'src/redis/redis.module';
import { BullModule } from '@nestjs/bullmq';
import { GameGateway } from './game.gateway';
import { Queues } from 'src/shared/queues';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Env } from 'src/shared/env';
import { QueueService } from './queue.service';
import { TurnCountdownConsumer } from './turn-countdown.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: Queues.PLAYER,
    }),
    BullModule.registerQueue({
      name: Queues.TURN_COUNTDOWN,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(...[configservice]: [ConfigService<Env>]) {
        return {
          secret: configservice.getOrThrow<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: '1h',
          },
        };
      },
    }),
    RedisModule,
  ],
  providers: [GameService, QueueService, GameGateway, TurnCountdownConsumer],
})
export class GameModule {}
