import { container } from '@/shared/infrastructure/container';
import { IDependencyContainer } from '@/shared/domain/container/dependency.container';

import config from '@/shared/infrastructure/config';
import { TYPES } from '@/shared/infrastructure/d-injection/types';

import { Logger } from '@/shared/domain/logger';
import { LoggerMock } from '@/shared/infrastructure/logger/logger.mock';

import { Server } from '@/shared/domain/http-framework/server.interface';
//import { ExpressServer } from '@/shared/infrastructure/http-framework/express/express.server';
import { FastifyServer } from '@/shared/infrastructure/http-framework/fastify/fastify.server';

import { EventBus } from '@/shared/domain/event-bus/event.bus';
import { RabbitMQEventBus } from '@/shared/infrastructure/event-bus/rabbitmq/rabbitmq.event.bus';

import { PostgresDatabase } from '@/shared/infrastructure/database/postgresql/postgres.database';
import { DatabaseConnection } from '@/shared/domain/database/database.interface';

import { StartModule } from '@/shared/domain/bootstrap';
import { modules } from '@/index';

import { CacheService } from '@/shared/infrastructure/cache/redis.cache';
import { ICacheServer } from '@/shared/domain/cache/cache.server';

import { RedisIOServer } from '@/shared/infrastructure/cache/redis.io.cache';
import { CacheIO } from '@/shared/domain/cache/cache.io.server';

import { IAuthentication } from '@/shared/domain/auth/authentication.interface';
import { JSONWebTokenAuth } from '@/shared/infrastructure/auth/json-web-token.auth';

import {
  NodeMailer,
  options
} from '@/shared/infrastructure/mailer/nodemailer.mailer';
import { IMailer } from '@/shared/domain/mail/mailer.interface';

import { DayJS, dateType } from '@/shared/infrastructure/dates/dayjs.date';
import { IDates } from '@/shared/domain/dates/dates.interface';

import { BcrypEncryption } from '@/shared/infrastructure/encryption/bcrypt.encryption';
import { IEncrypt } from '@/shared/domain/encryption/encrypt.interface';

export class AppDependencies {
  constructor(private container: IDependencyContainer) {}

  register() {
    this.configLogger();
    this.configModule();
    this.configCacheService();
    this.configServer();
    this.configDatabase();
    this.configEventBus();
    this.configAuthentication();
    this.configMailer();
    this.configDates();
    this.configEncryption();
    this.configCacheIOService();
  }

  private configLogger() {
    this.container.bind<Logger>(
      TYPES.Logger,
      'to',
      LoggerMock,
      [],
      'singleton'
    );
  }

  private configEncryption() {
    this.container.bind<IEncrypt>(
      TYPES.IEncrypt,
      'to',
      BcrypEncryption,
      [],
      'singleton'
    );
  }

  private configMailer() {
    this.container.bind<IMailer<options>>(
      TYPES.IMailer,
      'to',
      NodeMailer,
      [],
      'singleton'
    );
  }

  private configDates() {
    this.container.bind<IDates<dateType>>(
      TYPES.IDates,
      'to',
      DayJS,
      [],
      'singleton'
    );
  }

  private configAuthentication() {
    this.container.bind<IAuthentication>(
      TYPES.IAuthentication,
      'to',
      JSONWebTokenAuth,
      [],
      'singleton'
    );
  }

  private configModule() {
    for (const Module of modules) {
      this.container.bind<StartModule>(TYPES.StartModule, 'dynamic', Module, [
        TYPES.Logger
      ]);
    }
  }

  private configCacheService() {
    this.container.bind<ICacheServer>(
      TYPES.CacheService,
      'dynamic',
      CacheService,
      [TYPES.Logger],
      'singleton'
    );
  }

  private configCacheIOService() {
    this.container.bind<CacheIO>(
      TYPES.CacheIO,
      'dynamic',
      RedisIOServer,
      [TYPES.Logger],
      'singleton'
    );
  }

  private configServer() {
    this.container.bind<Server<unknown>>(
      TYPES.Framework,
      'dynamic',
      FastifyServer,
      [TYPES.Logger, TYPES.CacheIO],
      'singleton'
    );
  }

  private configDatabase() {
    this.container.bind<DatabaseConnection<unknown>>(
      TYPES.DatabaseConnection,
      'dynamic',
      PostgresDatabase,
      [TYPES.Logger],
      'singleton'
    );
  }

  private configEventBus() {
    const { user, password, host, port, queue, exchange } =
      config.buses.rabbitmq;

    this.container.bind<EventBus>(
      TYPES.EventBus,
      'dynamic',
      RabbitMQEventBus,
      [
        TYPES.Logger,
        {
          user,
          password,
          host,
          port,
          queue,
          exchange,
          retries: 5,
          interval: 60
        }
      ],
      'singleton'
    );
  }
}
