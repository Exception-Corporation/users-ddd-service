import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { TYPES } from '@/shared/infrastructure/d-injection/types';
import { DataSource } from 'typeorm';
import { DatabaseConnection } from '@/shared/domain/database/database.interface';
import { Logger } from '@/shared/domain/logger';
import postgresConfig from '@/shared/infrastructure/database/postgresql/config';
import { PostgresConfig } from '@/shared/infrastructure/database/postgresql/config/types';

@injectable()
export class PostgresDatabase implements DatabaseConnection<DataSource> {
  private appDataSource: DataSource;
  private postgresConfig: PostgresConfig;

  constructor(
    @inject(TYPES.Logger) private readonly logger: Logger,
    private port?: number
  ) {
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

  async closeConnection(): Promise<void> {
    await this.appDataSource.destroy();
  }

  getConnection() {
    return this.appDataSource;
  }

  static getConnectionToMigrate() {
    return new DataSource(postgresConfig as any);
  }
}

export default PostgresDatabase.getConnectionToMigrate();
