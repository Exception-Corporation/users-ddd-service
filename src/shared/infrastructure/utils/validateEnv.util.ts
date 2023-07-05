import { cleanEnv, port, str, host, email, bool } from 'envalid';

declare const process: any;

const validateEnv = () => {
  cleanEnv(process.env, {
    PROJECT_PORT: port(),
    PROJECT_HOST: host(),
    PROJECT_MODE: str(),
    PROJECT_NAME: str(),

    SWAGGER_IS_PUBLIC: bool(),
    SWAGGER_HTML_ENDPOINT: str(),
    SWAGGER_JSON_ENDPOINT: str(),

    JWT_ACCESS_TOKEN_PRIVATE_KEY: str(),
    JWT_ACCESS_TOKEN_PUBLIC_KEY: str(),
    JWT_REFRESH_TOKEN_PRIVATE_KEY: str(),
    JWT_REFRESH_TOKEN_PUBLIC_KEY: str(),

    POSTGRES_DB: str(),
    POSTGRES_USER: str(),
    POSTGRES_ROL: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_HOST: str(),
    POSTGRES_PORT: port(),
    POSTGRES_PORT_TEST: port(),
    PGADMIN_DEFAULT_EMAIL: email(),
    PGADMIN_DEFAULT_PASSWORD: str(),
    PGADMIN_PORT: port(),
    ADMIN_PASSWORD: str(),

    REDIS_IS_SECURE: bool(),
    REDIS_HOSTNAME: host(),
    REDIS_PORT: port(),
    REDIS_USERNAME: str(),
    REDIS_PASSWORD: str(),

    REDIS_COMMANDER_USER: str(),
    REDIS_COMMANDER_PASSWORD: str(),
    REDIS_COMMANDER_PORT: str(),

    MAILER_HOST: host(),
    MAILER_PORT: str(),
    MAILER_EMAIL: email(),
    MAILER_PASSWORD: str(),

    RATE_LIMIT_DURATION_MS: str(),
    RATE_LIMIT_MAX_REQUESTS_WITHIN_DURATION: str(),

    RABBITMQ_DEFAULT_USER: str(),
    RABBITMQ_DEFAULT_PASS: str(),
    RABBITMQ_PORT: port(),
    RABBITMQ_HOST: host(),
    RABBITMQ_QUEUE: str(),
    RABBITMQ_EXCHANGE: str()
  });
};

export default validateEnv;
