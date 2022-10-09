import { createClient, RedisClientType } from "redis";
import { ICacheServer } from "@/shared/domain/interfaces/cache.server";
import { Logger } from "@/shared/domain/logger";
import config from "@/shared/infrastructure/config";

const CACHE = config.cache.redis;

export class CacheService implements ICacheServer {
  private static instance: CacheService;
  private clients: Array<RedisClientType | undefined> = [];
  private constructor(private logger: Logger) {}

  static getInstance(logger: Logger): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService(logger);
    }
    return CacheService.instance;
  }

  public async cacheConnect(redisDB: number): Promise<void> {
    if (!this.clients[redisDB]) {
      const uri = `redis${CACHE.isSecure === true ? "s" : ""}://${
        CACHE.password ? `:${CACHE.password}@` : ""
      }${CACHE.hostname}:${CACHE.port}/${redisDB}`;

      this.clients[redisDB] = createClient({
        url: uri,
      });

      this.clients[redisDB]?.on("ready", () =>
        this.logger.info(`Redis clients connected on port ${CACHE.port}`)
      );
      this.clients[redisDB]?.on("reconnecting", () =>
        this.logger.warn("Redis clients reconnecting")
      );
      this.clients[redisDB]?.on("error", (err) =>
        this.logger.error({
          entityinfo: { class: `[${CacheService.name}]` },
          level: "error",
          message: "Redis client error",
          module: "Redis",
          type: "",
          params: { redisDB },
        })
      );

      await this.clients[redisDB]?.connect();
    } else {
      this.logger.warn("Redis clients already connected");
    }
  }

  public async cacheDisconnect(redisDB: number): Promise<void> {
    if (this.cacheIsConnected(redisDB)) {
      await this.clients[redisDB]?.quit();
      this.clients[redisDB] = undefined;
    }
  }

  public cacheIsConnected(redisDB: number): boolean {
    return this.clients[redisDB]?.isOpen ?? false;
  }

  public async cachePing(redisDB: number): Promise<string> {
    return this.clients[redisDB]
      ? this.cacheIsConnected(redisDB)
        ? await this.clients[redisDB]!.ping() //We know for show client exist because is checked previously
        : "Redis clients not connected"
      : "Client doesn't exist";
  }

  public async cacheGetAllKeys(redisDB: number): Promise<any> {
    return await this.clients[redisDB]?.keys("*");
  }

  public async cacheGet(
    redisDB: number,
    key: string
  ): Promise<string | undefined | null> {
    return await this.clients[redisDB]?.get(key);
  }

  public async cacheSet(
    redisDB: number,
    key: string,
    value: any,
    ttl?: number
  ): Promise<number | string | undefined | null> {
    const result = await this.clients[redisDB]?.set(key, value);
    if (ttl) await this.clients[redisDB]?.expire(key, ttl);
    return result;
  }

  public async cacheDelete(
    redisDB: number,
    key: string
  ): Promise<number | undefined> {
    return await this.clients[redisDB]?.del(key);
  }

  public async cacheDeleteByPattern(
    redisDB: number,
    pattern: string
  ): Promise<number | undefined> {
    const foundKeys: string[] | undefined = await this.clients[redisDB]?.keys(
      `${pattern}*`
    );
    return foundKeys
      ? await this.clients[redisDB]?.sendCommand(["DEL", ...foundKeys])
      : 0;
  }

  public async cacheDeleteAll(redisDB: number): Promise<void> {
    await this.clients[redisDB]?.flushDb();
  }
}
