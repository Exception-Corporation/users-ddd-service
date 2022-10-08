export interface ICacheServer {
  cacheConnect(cacheDB: number): Promise<void>;
  cacheDisconnect(cacheDB: number): Promise<void>;
  cacheIsConnected(cacheDB: number): boolean;
  cachePing(cacheDB: number): Promise<string>;
  cacheGetAllKeys(cacheDB: number): Promise<any>;
  cacheGet(cacheDB: number, key: string): Promise<string | undefined | null>;
  cacheSet(
    cacheDB: number,
    key: string,
    value: string,
    ttl?: number
  ): Promise<number | string | undefined | null>;
  cacheDelete(cacheDB: number, key: string): Promise<number | undefined>;
  cacheDeleteByPattern(
    cacheDB: number,
    pattern: string
  ): Promise<number | undefined>;
  cacheDeleteAll(cacheDB: number): Promise<void>;
}
