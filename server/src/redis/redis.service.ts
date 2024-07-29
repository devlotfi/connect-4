import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { Env } from 'src/shared/env';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  public constructor(private readonly configService: ConfigService<Env>) {}

  private readonly logger = new Logger(RedisService.name);

  private _client = createClient({
    password: this.configService.getOrThrow<string>('REDIS_PASSWORD'),
    socket: {
      host: this.configService.getOrThrow<string>('REDIS_HOST'),
      port: this.configService.getOrThrow<number>('REDIS_PORT'),
    },
  });
  public get client() {
    return this._client;
  }

  public async onModuleInit() {
    await this.client.connect();
    this.logger.debug('Connected to redis');
  }

  public async onModuleDestroy() {
    await this.client.disconnect();
    this.logger.debug('Disconnected from redis');
  }
}
