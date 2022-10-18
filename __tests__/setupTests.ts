//import { User } from "../src/user/v1/infrastructure/models/user.entity";
import config from '../src/shared/infrastructure/config';
import { modules } from '../src/index';
import { PostgresDatabase } from '../src/shared/infrastructure/database/postgresql/postgres.database';

// Initialize modules
for (const Bootstrap of modules) {
  new Bootstrap().init();
}

const database = new PostgresDatabase(
  console as any,
  config.database_test.postgres.port
);

beforeAll(async () => {
  //await database.connect();
});

beforeEach(async () => {});

afterEach(async () => {});

afterAll(async () => {
  //await database.closeConnection();
});
