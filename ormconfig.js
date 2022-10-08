module.exports = {
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: "all",
  entities: ["src/**/**.entity{.ts,.js}"],
  migrations: ["migrations/*{.ts,.js}"],
  subscribers: [
    "src/shared/infrastructure/database/postgresql/subscribers/**/*{.ts,.js}",
  ],
  cli: {
    migrationsDir: "migrations/",
  },
};
