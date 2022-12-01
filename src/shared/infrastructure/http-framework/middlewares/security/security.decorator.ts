import { AutorizationRouter } from '@/shared/infrastructure/http-framework/middlewares/security/security.middleware';
import { MainLogger } from '@/shared/infrastructure/logger/main';

export function GuardWithJwt(roles: Array<string>) {
  return (target: Function) => {
    target.prototype.middlewares = target.prototype.middlewares || [];
    target.prototype.middlewares.push(
      new AutorizationRouter(MainLogger).isAuth(roles)
    );
    target.prototype.isAuth = true;
    target.prototype.roles = roles;
  };
}
