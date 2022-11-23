import { StartModule } from '@/shared/domain/interfaces/bootstrap';
import { CacheService } from '@/shared/infrastructure/cache/redis.cache';
import { PostgresDatabase } from '@/shared/infrastructure/database/postgresql/postgres.database';
import { Application } from '@/shared/infrastructure/servers/express.server';
import { MainLogger } from '@/shared/infrastructure/logger/main/';
import { MainEventBus } from '@/shared/infrastructure/event-bus';
import config from '@/shared/infrastructure/config';
import { RequireService } from '@/shared/infrastructure/auto-files';

export class SharedBootstrap implements StartModule {
  async init(): Promise<void> {
    try {
      if (!config.test) {
        const database = new PostgresDatabase(MainLogger);

        await database.connect();

        const cacheService = CacheService.getInstance(MainLogger);

        await cacheService.cacheConnect(0);

        await this.startEventBus();

        const server = new Application(MainLogger);

        await server.getApp().initialize();
      }
    } catch (error: any) {
      MainLogger.error({
        type: 'BOOTSTRAP_ERROR',
        message: `[${SharedBootstrap.name}] Error ${
          error?.message || error.toString()
        }`,
        module: 'SHARED',
        level: 'error'
      });
    }
  }

  private async startEventBus(): Promise<void> {
    const subscriberDefinitions = RequireService.getFiles(
      'src/**/gateway/events/*.event.ts',
      ['on', 'subscribedTo']
    ).map((Subscriber: any) => new Subscriber(MainEventBus, MainLogger));

    MainEventBus.addSubscribers(subscriberDefinitions);
    MainEventBus.start();
  }
}
