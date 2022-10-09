import config from "@/shared/infrastructure/config";

const { postgres } = config.database;

export default {
  host: postgres.host,
  port: postgres.port,
  username: postgres.user,
  password: postgres.password,
  database: postgres.database,
  rol: postgres.rol,
  logging: "all",
  maxQueryExecutionTime: 2000,
  type: "postgres",
  synchronize: false,
  entities: ["src/**/**.entity{.ts,.js}"],
  migrations: ["migrations/*{.ts,.js}"],
  subscribers: [
    "src/shared/infrastructure/database/postgresql/subscribers/**/*{.ts,.js}",
  ],
};
