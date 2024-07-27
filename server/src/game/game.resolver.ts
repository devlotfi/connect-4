import { Query, Resolver, Subscription } from '@nestjs/graphql';
import { RedisService } from 'src/redis/redis.service';

@Resolver()
export class GameResolver {
  public constructor(private readonly redisService: RedisService) {}

  @Query(() => String)
  public test() {
    return 'lol';
  }

  @Subscription(() => String)
  public joinSub() {
    return this.redisService.redisPubSub.asyncIterator('test');
  }
}
