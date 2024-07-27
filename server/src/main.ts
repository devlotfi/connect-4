import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './shared/env';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<Env>);

  app.enableCors({
    origin: [configService.getOrThrow<string>('CLIENT_URL')],
  });

  const PORT: number = configService.getOrThrow<number>('PORT');
  await app.listen(PORT);
  Logger.debug(`App listening on http://localhost:${PORT}`);
}
bootstrap();
