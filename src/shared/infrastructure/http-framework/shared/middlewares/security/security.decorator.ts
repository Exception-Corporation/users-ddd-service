import { AutorizationRouter } from '@/shared/infrastructure/http-framework/fastify/middlewares/security.middleware';
import { AppContainer } from '@/shared/infrastructure/d-injection/container';

export function GuardWithJwt(roles: Array<string>) {
  return (target: Function) => {
    target.prototype.middlewares = target.prototype.middlewares || [];
    target.prototype.middlewares.push(
      AppContainer.resolve(AutorizationRouter).isAuth(roles)
    );
    target.prototype.isAuth = true;
    target.prototype.roles = roles;
  };
}
