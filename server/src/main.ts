import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './shared/env';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RedisIoAdapter } from './shared/redis-io-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<Env>);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: true,
  });

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  const PORT: number = configService.getOrThrow<number>('PORT');
  await app.listen(PORT);
  Logger.debug(`App listening on http://localhost:${PORT}`);
}
bootstrap();
