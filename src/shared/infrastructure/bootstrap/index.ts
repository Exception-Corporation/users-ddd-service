import { StartModule } from "../../domain/interfaces/bootstrap";
import { CacheService } from "../cache/redis.cache";
import { PostgresDatabase } from "../database/postgresql/postgres.database";
import { Application } from "../servers/express.server";

export class SharedBootstrap implements StartModule {
  async init(): Promise<void> {
    try {
      const database = new PostgresDatabase();

      await database.connect();

      const cacheService = CacheService.getInstance();

      await cacheService.cacheConnect(0);

      const server = new Application();

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
