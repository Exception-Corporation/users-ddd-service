import { Container, interfaces } from 'inversify';

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
  register(container: Container) {
    this.configLogger(container);
    this.configModule(container);
    this.configCacheService(container);
    this.configServer(container);
    this.configDatabase(container);
    this.configEventBus(container);
    this.configAuthentication(container);
    this.configMailer(container);
    this.configDates(container);
    this.configEncryption(container);
    this.configCacheIOService(container);
  }

  private configLogger(container: Container) {
    container.bind<Logger>(TYPES.Logger).to(LoggerMock).inSingletonScope();
  }

  private configEncryption(container: Container) {
    container
      .bind<IEncrypt>(TYPES.IEncrypt)
      .to(BcrypEncryption)
      .inSingletonScope();
  }

  private configMailer(container: Container) {
    container
      .bind<IMailer<options>>(TYPES.IMailer)
      .to(NodeMailer)
      .inSingletonScope();
  }

  private configDates(container: Container) {
    container.bind<IDates<dateType>>(TYPES.IDates).to(DayJS).inSingletonScope();
  }

  private configAuthentication(container: Container) {
    container
      .bind<IAuthentication>(TYPES.IAuthentication)
      .to(JSONWebTokenAuth)
      .inSingletonScope();
  }

  private configModule(container: Container) {
    for (const Module of modules) {
      container
        .bind<StartModule>(TYPES.StartModule)
        .toDynamicValue(
          (context: interfaces.Context) =>
            new Module(context.container.get<Logger>(TYPES.Logger))
        );
    }
  }

  private configCacheService(container: Container) {
    container
      .bind<ICacheServer>(TYPES.CacheService)
      .toDynamicValue(
        (context: interfaces.Context) =>
          new CacheService(context.container.get<Logger>(TYPES.Logger))
      )
      .inSingletonScope();
  }

  private configCacheIOService(container: Container) {
    container
      .bind<CacheIO>(TYPES.CacheIO)
      .toDynamicValue(
        (context: interfaces.Context) =>
          new RedisIOServer(context.container.get<Logger>(TYPES.Logger))
      )
      .inSingletonScope();
  }

  private configServer(container: Container) {
    container
      .bind<Server<unknown>>(TYPES.Framework)
      .toDynamicValue(
        (context: interfaces.Context) =>
          new FastifyServer(
            context.container.get<Logger>(TYPES.Logger),
            context.container.get<CacheIO>(TYPES.CacheIO)
          )
      );
  }

  private configDatabase(container: Container) {
    container
      .bind<DatabaseConnection<unknown>>(TYPES.DatabaseConnection)
      .toDynamicValue(
        (context: interfaces.Context) =>
          new PostgresDatabase(context.container.get<Logger>(TYPES.Logger))
      );
  }

  private configEventBus(container: Container) {
    container
      .bind<EventBus>(TYPES.EventBus)
      .toDynamicValue((context: interfaces.Context) => {
        const { user, password, host, port, queue, exchange } =
          config.buses.rabbitmq;

        return new RabbitMQEventBus(
          context.container.get<Logger>(TYPES.Logger),
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
        );
      })
      .inSingletonScope();
  }
}
