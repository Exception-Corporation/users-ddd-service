import { User as UserModel } from '../src/user/v1/infrastructure/models/user.entity';
import { PostgresDatabase } from '../src/shared/infrastructure/database/postgresql/postgres.database';

const database = new PostgresDatabase(console as any);

declare const process: any;

database
  .connect()
  .then(() => {
    UserModel.save({
      firstname: 'admin',
      lastname: '1.0',
      username: 'admin',
      phone: '0',
      email: 'admin@admin.com',
      password: process.env.ADMIN_PASSWORD,
      role: 'root',
      age: 30,
      active: true
    })
      .then(() => {
        console.log('User created');
        process.exit(0);
      })
      .catch((e) => {
        console.error('SAVE METHOD: ' + e);
        process.exit(0);
      });
  })
  .catch((e) => {
    console.error('CONNECTION METHOD: ' + e);
    process.exit(0);
  });
