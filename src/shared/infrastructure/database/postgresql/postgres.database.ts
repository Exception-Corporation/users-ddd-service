import "reflect-metadata";
import { DataSource } from "typeorm";
import { DatabaseConnection } from "@/shared/domain/interfaces/database.interface";
import { Logger } from "@/shared/domain/logger";
import postgresConfig from "@/shared/infrastructure/database/postgresql/config";
import { PostgresConfig } from "@/shared/infrastructure/database/postgresql/config/types";

export class PostgresDatabase implements DatabaseConnection<DataSource> {
  private appDataSource: DataSource;
  private postgresConfig: PostgresConfig;

  constructor(private logger: Logger, private port?: number) {
    this.postgresConfig = postgresConfig;

    if (this.port) this.postgresConfig.port = this.port;

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

  async closeConnection(): Promise<void> {
    await this.appDataSource.destroy();
  }
}

export default new PostgresDatabase(console as any).getConnection();
