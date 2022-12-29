import config from '@/shared/infrastructure/config';
import { RequireContext } from '@/shared/infrastructure/auto-files/require.context';

const { postgres } = config.database;

export default {
  host: postgres.host,
  port: postgres.port,
  username: postgres.user,
  password: postgres.password,
  database: postgres.database,
  rol: postgres.rol,
  logging: postgres.logging ? 'all' : false,
  maxQueryExecutionTime: 2000,
  type: 'postgres',
  synchronize: false,
  entities: postgres.ORM_UP
    ? ['src/**/**.entity{.ts,.js}', 'build/**/**.entity{.ts,.js}']
    : RequireContext.getFiles(
        require.context('@/*', true, /^((?!!+).)*entity.ts$/),
        ['entityModel']
      ),
  migrations: postgres.ORM_UP ? ['migrations/*{.ts,.js}'] : [],
  subscribers: []
};
