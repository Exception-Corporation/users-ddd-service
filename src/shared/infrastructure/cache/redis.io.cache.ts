import { inject, injectable } from 'inversify';
import redis, { Redis } from 'ioredis';
import { Logger } from '@/shared/domain/logger';
import { CacheIO } from '@/shared/domain/cache/cache.io.server';
import { TYPES } from '@/shared/infrastructure/d-injection/types';
import config from '@/shared/infrastructure/config';

@injectable()
export class RedisIOServer implements CacheIO {
  private connection: Redis;
  private CACHE: typeof config.cache.redis;

  constructor(@inject(TYPES.Logger) private readonly logger: Logger) {
    this.CACHE = config.cache.redis;

    const uri = `redis${this.CACHE.isSecure === true ? 's' : ''}://${
      this.CACHE.password ? `:${this.CACHE.password}@` : ''
    }${this.CACHE.hostname}:${this.CACHE.port}`;

    this.connection = new redis(uri);

    this.connection.on('ready', this.readyConnection);
    this.connection.on('error', this.errorConnection);
  }

  getConnection(): Redis {
    return this.connection;
  }

  private readyConnection = () => {
    this.logger.info(`[${RedisIOServer.name}] Redis connected!`);
  };

  private errorConnection = (error: Error) => {
    this.logger.error({
      message: `[${RedisIOServer.name}] Redis error: ${error.message}`,
      level: 'error',
      type: 'CONNECTION_ERROR',
      module: 'DATABASE'
    });
  };
}
