import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { createHash } from 'crypto';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class CacheService {
  logger = new Logger(CacheService.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly appConfigService: AppConfigService,
  ) {}

  async get(key: string) {
    if (this.appConfigService.isDevelopment) {
      return null;
    }
    return this.cacheManager.get(key);
  }

  async set(key: string, value: any, ttl?: number) {
    if (this.appConfigService.isDevelopment) {
      return value;
    }
    return this.cacheManager.set(key, value, ttl);
  }

  async delete(key: string) {
    if (this.appConfigService.isDevelopment) {
      return;
    }
    this.logger.log('Delete Cache: ' + key);
    return this.cacheManager.del(key);
  }

  async getKeys(pattern: string) {
    if (this.appConfigService.isDevelopment) {
      return [];
    }
    return this.cacheManager.store.keys(pattern);
  }

  async deleteKeys(pattern: string) {
    if (this.appConfigService.isDevelopment) {
      return;
    }
    const keys = await this.cacheManager.store.keys(pattern);
    return Promise.all(keys.map((key) => this.cacheManager.del(key)));
  }

  generateKey(prefix: string, ...parts: string[]): string {
    if (this.appConfigService.isDevelopment) {
      return `${prefix}:${parts.join(':')}`;
    }
    const key = [prefix, ...parts].join(':');
    return `${prefix}:${createHash('md5').update(key).digest('hex')}`;
  }

  matchKey(generatedKey: string): string {
    if (this.appConfigService.isDevelopment) {
      return generatedKey;
    }
    const [prefix, hash] = generatedKey.split(':');
    return `${prefix}:${hash}`;
  }
}
