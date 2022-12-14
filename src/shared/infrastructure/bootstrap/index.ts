import { injectable, inject } from 'inversify';
import { TYPES } from '@/shared/infrastructure/d-injection/types';
import { StartModule } from '@/shared/domain/bootstrap';
import { Server } from '@/shared/domain/http-framework/server.interface';
import { EventBus } from '@/shared/domain/event-bus/event.bus';
import config from '@/shared/infrastructure/config';
import { Logger } from '@/shared/domain/logger';
import { AppDependencies } from '@/shared/infrastructure/d-injection/config';
import { AppContainer } from '@/shared/infrastructure/d-injection/container';
import { ICacheServer } from '@/shared/domain/cache/cache.server';
import { DatabaseConnection } from '@/shared/domain/database/database.interface';
import { DomainEventSubscriber } from '@/shared/domain/event-bus/domain.event.subscriber';
import { DomainEvent } from '@/shared/domain/event-bus/domain.event';

@injectable()
export class SharedBootstrap implements StartModule {
  constructor(@inject(TYPES.Logger) private readonly logger: Logger) {}
  async init(): Promise<void> {
    try {
      if (!config.test.isDefined) {
        await this.startDatabase();

        await this.startCacheService();

        await this.startEventBus();

        await this.startFramework();

        return;
      }

      new AppDependencies().register(AppContainer);
    } catch (error: any) {
      this.logger.error({
        type: 'BOOTSTRAP_ERROR',
        message: `[${SharedBootstrap.name}] Error ${
          error?.message || error.toString()
        }`,
        module: 'SHARED',
        level: 'error'
      });
    }
  }

  private async startCacheService(): Promise<void> {
    const cacheService = AppContainer.get<ICacheServer>(TYPES.CacheService);
    await cacheService.cacheConnect(0);
  }

  private async startDatabase(): Promise<void> {
    const databaseConnection = AppContainer.get<DatabaseConnection<unknown>>(
      TYPES.DatabaseConnection
    );
    await databaseConnection.connect();
  }

  private async startFramework(): Promise<void> {
    const framework = AppContainer.get<Server<unknown>>(TYPES.Framework);
    (await framework.getApp()).initialize();
  }

  private async startEventBus(): Promise<void> {
    const eventBus = AppContainer.get<EventBus>(TYPES.EventBus);

    const subscriberDefinitions = AppContainer.getAll<
      DomainEventSubscriber<DomainEvent>
    >(TYPES.DomainEventSubscriber);

    eventBus.addSubscribers(subscriberDefinitions);
    await eventBus.start();
  }
}
