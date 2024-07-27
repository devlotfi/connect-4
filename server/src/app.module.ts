import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { GameModule } from './game/game.module';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { BullModule } from '@nestjs/bullmq';
import { Env } from './shared/env';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      subscriptions: {
        'graphql-ws': {
          onConnect(ctx) {
            console.log(ctx);
          },
        },
      },
    }),
    RedisModule,
    GameModule,
  ],
})
export class AppModule {}
