import dotenv from "dotenv";
import validateEnv from "@/shared/infrastructure/utils/validateEnv.util";

dotenv.config({});

declare const process: any;

validateEnv();

export default {
  project: {
    port: process.env.PROJECT_PORT,
    host: process.env.PROJECT_HOST,
    mode: process.env.PROJECT_MODE,
  },
  authentication: {
    accessTokenExpiresIn: 15,
    refreshTokenExpiresIn: 60,
    redisCacheExpiresIn: 60,
    accessTokenPrivateKey: process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY,
    accessTokenPublicKey: process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY,
    refreshTokenPrivateKey: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
    refreshTokenPublicKey: process.env.JWT_REFRESH_TOKEN_PUBLIC_KEY,
  },
  database: {
    postgres: {
      user: process.env.POSTGRES_USER,
      rol: process.env.POSTGRES_ROL,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      database: process.env.POSTGRES_DB,
    },
  },
  database_test: {
    postgres: {
      user: process.env.POSTGRES_USER,
      rol: process.env.POSTGRES_ROL,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT_TEST,
      database: process.env.POSTGRES_DB,
    },
  },
  cache: {
    redis: {
      isSecure: process.env.REDIS_IS_SECURE ?? false,
      hostname: process.env.REDIS_HOSTNAME,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      database: {
        credentials: process.env.REDIS_DB_CREDENTIALS,
        cancellations: process.env.REDIS_DB_CANCELLATIONS,
        labels: process.env.REDIS_DB_LABELS,
        rates: process.env.REDIS_DB_RATES,
        pickup: process.env.REDIS_DB_PICKUP,
        tracking: process.env.REDIS_DB_TRACKING,
        branchOffices: process.env.REDIS_DB_BRANCH_OFFICES,
        zones: process.env.REDIS_DB_ZONES,
      },
    },
  },
};
