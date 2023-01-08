import { User as UserModel } from '../src/user/v1/infrastructure/models/user.entity';
import { PostgresDatabase } from '../src/shared/infrastructure/database/postgresql/postgres.database';
import { BcrypEncryption } from '../src/shared/infrastructure/encryption/bcrypt.encryption';

const database = new PostgresDatabase(console as any);
const encryption = new BcrypEncryption();

declare const process: any;

(async () => {
  try {
    await database.connect();

    UserModel.save({
      firstname: 'admin',
      lastname: '1.0',
      username: 'admin',
      phone: '0',
      email: 'admin@admin.com',
      password: await encryption.encrypt(process.env.ADMIN_PASSWORD, 2),
      role: 'root',
      age: 30,
      active: true
    });
  } catch (error: any) {
    console.error('CONNECTION METHOD: ' + error);
  }

  process.exit(0);
})();
