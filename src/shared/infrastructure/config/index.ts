import dotenv from 'dotenv';
import validateEnv from '@/shared/infrastructure/utils/validateEnv.util';

dotenv.config({});

declare const process: any;

validateEnv();

export default {
  project: {
    port: process.env.PROJECT_PORT,
    host: process.env.PROJECT_HOST,
    mode: process.env.PROJECT_MODE,
    name: process.env.PROJECT_NAME
  },
  swagger: {
    isPublic: process.env.SWAGGER_IS_PUBLIC,
    html: process.env.SWAGGER_HTML_ENDPOINT,
    json: process.env.SWAGGER_JSON_ENDPOINT
  },
  authentication: {
    accessTokenExpiresIn: 15,
    refreshTokenExpiresIn: 60,
    redisCacheExpiresIn: 60,
    accessTokenPrivateKey: process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY,
    accessTokenPublicKey: process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY,
    refreshTokenPrivateKey: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
    refreshTokenPublicKey: process.env.JWT_REFRESH_TOKEN_PUBLIC_KEY
  },
  database: {
    postgres: {
      user: process.env.POSTGRES_USER,
      rol: process.env.POSTGRES_ROL,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      database: process.env.POSTGRES_DB,
      logging: process.env.PROJECT_MODE == 'development',
      ORM_UP: process.env.ORM_UP
    }
  },
  database_test: {
    postgres: {
      user: process.env.POSTGRES_USER,
      rol: process.env.POSTGRES_ROL,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT_TEST,
      database: process.env.POSTGRES_DB
    }
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
        zones: process.env.REDIS_DB_ZONES
      }
    }
  },
  mailer: {
    nodemailer: {
      host: process.env.MAILER_HOST,
      port: process.env.MAILER_PORT,
      email: process.env.MAILER_EMAIL,
      password: process.env.MAILER_PASSWORD
    }
  },
  test: {
    isDefined: process.env.JEST_WORKER_ID !== undefined
  },
  RateLimit: {
    duration: process.env.RATE_LIMIT_DURATION_MS,
    request: process.env.RATE_LIMIT_MAX_REQUESTS_WITHIN_DURATION
  },
  buses: {
    rabbitmq: {
      user: process.env.RABBITMQ_DEFAULT_USER,
      password: process.env.RABBITMQ_DEFAULT_PASS,
      host: process.env.RABBITMQ_HOST,
      port: process.env.RABBITMQ_PORT,
      queue: process.env.RABBITMQ_QUEUE,
      exchange: process.env.RABBITMQ_EXCHANGE
    }
  }
};
