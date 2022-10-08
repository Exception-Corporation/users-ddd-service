import { StartModule } from "../../domain/interfaces/bootstrap";
import { CacheService } from "../cache/redis.cache";
import { PostgresDatabase } from "../database/postgresql/postgres.database";
import { Application } from "../servers/express.server";
import { LoggerMock } from "../logger/logger.mock";
import { Logger } from "../../domain/logger";

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
