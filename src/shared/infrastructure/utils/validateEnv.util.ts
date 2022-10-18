import { cleanEnv, port, str, host, email } from 'envalid';

declare const process: any;

const validateEnv = () => {
  cleanEnv(process.env, {
    PROJECT_PORT: port(),
    PROJECT_HOST: host(),
    PROJECT_MODE: str(),
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
    PGADMIN_PORT: port()
  });
};

export default validateEnv;
