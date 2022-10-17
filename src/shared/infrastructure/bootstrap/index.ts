import { StartModule } from "@/shared/domain/interfaces/bootstrap";
import { CacheService } from "@/shared/infrastructure/cache/redis.cache";
import { PostgresDatabase } from "@/shared/infrastructure/database/postgresql/postgres.database";
import { Application } from "@/shared/infrastructure/servers/express.server";
import { MainLogger } from "@/shared/infrastructure/logger/main/";
import config from "@/shared/infrastructure/config";

export class SharedBootstrap implements StartModule {
  async init(): Promise<void> {
    try {
      if (!config.test) {
        const database = new PostgresDatabase(MainLogger);

        await database.connect();

        const cacheService = CacheService.getInstance(MainLogger);

        await cacheService.cacheConnect(0);

        const server = new Application(MainLogger);

        await server.getApp().initialize();
      }
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
