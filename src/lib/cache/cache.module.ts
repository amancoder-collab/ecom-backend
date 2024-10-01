import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheService } from './cache.service';
import { AppConfigService } from '../config/config.service';

@Module({
  providers: [CacheService],
  imports: [
    NestCacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (appConfigService: AppConfigService) => ({
        store: redisStore,
        host: appConfigService.redisHost,
        port: appConfigService.redisPort,
        password: appConfigService.redisPassword,
        ttl: 60 * 60 * 1000 * 24,
      }),
      inject: [AppConfigService],
    }),
  ],
  exports: [CacheService],
})
export class CacheModule {}
