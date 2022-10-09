import { StartModule } from "@/shared/domain/interfaces/bootstrap";
import { CacheService } from "@/shared/infrastructure/cache/redis.cache";
import { PostgresDatabase } from "@/shared/infrastructure/database/postgresql/postgres.database";
import { Application } from "@/shared/infrastructure/servers/express.server";
import { LoggerMock } from "@/shared/infrastructure/logger/logger.mock";
import { Logger } from "@/shared/domain/logger";

export class SharedBootstrap implements StartModule {
  async init(): Promise<void> {
    const logger: Logger = new LoggerMock();
    try {
      const database = new PostgresDatabase(logger);

      await database.connect();

      const cacheService = CacheService.getInstance(logger);

      await cacheService.cacheConnect(0);

      const server = new Application(logger);

      await server.getApp().initialize();
    } catch (error) {
      console.error({
        type: "BOOTSTRAP_ERROR",
        message: `[${SharedBootstrap.name}] Error ${error}`,
        module: "SHARED",
        level: "error",
      });
    }
  }
}
