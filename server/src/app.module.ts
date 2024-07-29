import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { GameModule } from './game/game.module';
import { BullModule } from '@nestjs/bullmq';
import { Env } from './shared/env';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(...[configService]: [ConfigService<Env>]) {
        return {
          connection: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: configService.getOrThrow<number>('REDIS_PORT'),
            password: configService.getOrThrow<string>('REDIS_PASSWORD'),
          },
        };
      },
    }),
    RedisModule,
    GameModule,
  ],
})
export class AppModule {}
