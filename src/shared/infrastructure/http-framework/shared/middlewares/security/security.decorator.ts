import { AutorizationRouter } from '@/shared/infrastructure/http-framework/fastify/middlewares/security.middleware';
import { container } from '@/shared/infrastructure/container';

export function GuardWithJwt(roles: Array<string>) {
  return (target: Function) => {
    target.prototype.middlewares = target.prototype.middlewares || [];
    target.prototype.middlewares.push(
      container.resolve(AutorizationRouter).isAuth(roles)
    );
    target.prototype.isAuth = true;
    target.prototype.roles = roles;
  };
}
