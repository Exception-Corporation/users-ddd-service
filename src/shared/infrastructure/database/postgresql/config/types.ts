export type PostgresConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  rol: string;
  logging:
    | boolean
    | string
    | "all"
    | ("query" | "schema" | "error" | "warn" | "info" | "log" | "migration")[];
  maxQueryExecutionTime: number;
  type: string;
  synchronize: boolean;
  entities: Array<any>;
  migrations: Array<any>;
  subscribers: Array<any>;
};
