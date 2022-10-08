import "reflect-metadata";
import { DataSource } from "typeorm";
import { DatabaseConnection } from "../../../domain/interfaces/database.interface";
import { Logger } from "../../../domain/logger";
import postgresConfig from "./config";
import { PostgresConfig } from "./config/types";

export class PostgresDatabase implements DatabaseConnection<DataSource> {
  private appDataSource: DataSource;
  private postgresConfig: PostgresConfig;

  constructor(private logger: Logger) {
    this.postgresConfig = postgresConfig;

    this.appDataSource = new DataSource(this.postgresConfig as any);
  }
  async connect() {
    await this.appDataSource.initialize();

    this.logger.info(
      `[${PostgresDatabase.name}] connection succesfull in the port: [${this.postgresConfig.host}:${this.postgresConfig.port}]`
    );
  }

  getConnection() {
    return this.appDataSource;
  }
}

export default new PostgresDatabase(console as any).getConnection();
