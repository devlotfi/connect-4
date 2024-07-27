import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameResolver } from './game.resolver';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [GameService, GameResolver],
})
export class GameModule {}
