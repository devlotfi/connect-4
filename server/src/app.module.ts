import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [ConfigModule.forRoot(), RedisModule, GameModule],
})
export class AppModule {}
