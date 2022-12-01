import { AutorizationRouter } from '@/shared/infrastructure/http-framework/middlewares/security/security.middleware';
import { LoggerMock } from '@/shared/infrastructure/logger/logger.mock';

export function GuardWithJwt(roles: Array<string>) {
  return (target: Function) => {
    target.prototype.middlewares = target.prototype.middlewares || [];
    target.prototype.middlewares.push(
      new AutorizationRouter(new LoggerMock()).isAuth(roles)
    );
    target.prototype.isAuth = true;
    target.prototype.roles = roles;
  };
}
