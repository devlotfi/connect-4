import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import Redlock from 'redlock';
import { Env } from 'src/shared/env';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  public constructor(private readonly configService: ConfigService<Env>) {
    this._client = new Redis({
      password: this.configService.getOrThrow<string>('REDIS_PASSWORD'),
      host: this.configService.getOrThrow<string>('REDIS_HOST'),
      port: this.configService.getOrThrow<number>('REDIS_PORT'),
      lazyConnect: true,
    });

    this._redlock = new Redlock([this._client]);
  }

  private readonly logger = new Logger(RedisService.name);

  private _client: Redis;
  public get client() {
    return this._client;
  }

  private _redlock: Redlock;
  public get redlock(): Redlock {
    return this._redlock;
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
