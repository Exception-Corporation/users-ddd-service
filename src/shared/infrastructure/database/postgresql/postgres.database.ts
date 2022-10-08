import "reflect-metadata";
import { DataSource } from "typeorm";
import { DatabaseConnection } from "../../../domain/interfaces/database.interface";
import postgresConfig from "./config";
import { PostgresConfig } from "./config/types";

export class PostgresDatabase implements DatabaseConnection<DataSource> {
  private appDataSource: DataSource;
  private postgresConfig: PostgresConfig;

  constructor() {
    this.postgresConfig = postgresConfig;

    this.appDataSource = new DataSource(this.postgresConfig as any);
  }
  async connect() {
    await this.appDataSource.initialize();

    console.info(
      `[${PostgresDatabase.name}] connection succesfull in the port: [${this.postgresConfig.host}:${this.postgresConfig.port}]`
    );
  }

  getConnection() {
    return this.appDataSource;
  }
}

export default new PostgresDatabase().getConnection();
