import "reflect-metadata";
import { DataSource, LoggerOptions } from "typeorm";
import { DatabaseConnection } from "../../../domain/interfaces/database.interface";
import config from "../../config";

type PostgresConfig = {
  host: any;
  port: any;
  username: any;
  password: any;
  database: any;
  rol: any;
  logging: LoggerOptions;
  maxQueryExecutionTime: number;
};

export class PostgresDatabase implements DatabaseConnection {
  private appDataSource: DataSource;
  private postgresConfig: PostgresConfig;

  constructor() {
    const { postgres } = config.database;

    this.postgresConfig = {
      host: postgres.host,
      port: postgres.port,
      username: postgres.user,
      password: postgres.password,
      database: postgres.database,
      rol: postgres.rol,
      logging: "all",
      maxQueryExecutionTime: 2000,
    };

    this.appDataSource = new DataSource({
      ...this.postgresConfig,
      type: "postgres",
      synchronize: false,
      entities: ["src/**/**.entity{.ts,.js}"],
      migrations: [
        "src/shared/infrastructure/database/postgresql/migrations/**/*{.ts,.js}",
      ],
      subscribers: [
        "src/shared/infrastructure/database/postgresql/subscribers/**/*{.ts,.js}",
      ],
    });
  }
  async connect() {
    await this.appDataSource.initialize();

    console.info(
      `[${PostgresDatabase.name}] connection succesfull in the port: [${this.postgresConfig.host}:${this.postgresConfig.port}]`
    );
  }
}
