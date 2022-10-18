import { Router } from 'express';
import { RouterC } from '@/shared/domain/class/router.class';
import Controllers from '@/user/v1/infrastructure/controllers';
import { MiddlewareRouter } from '@/shared/infrastructure/middleware/security.middleware';

export class UserRouter extends RouterC<Router> {
  private router: Router = Router();
  private path: string;
  private authMiddleware: MiddlewareRouter;
  constructor() {
    super();

    this.authMiddleware = new MiddlewareRouter();

    this.path = '/api/v1/users';
    this.router;

    Controllers.forEach((Controller) => {
      const { path, handler, roles } = {
        path: `${this.path}${Controller.path}`,
        handler: Controller.execute.bind(Controller),
        roles: this.authMiddleware.isAuth(Controller.roles || [])
      };

      switch (Controller.http) {
        case 'get':
          this.router.get(path, roles, handler);
          break;
        case 'post':
          this.router.post(path, roles, handler);
          break;
        case 'put':
          this.router.put(path, roles, handler);
          break;
        case 'patch':
          this.router.patch(path, roles, handler);
          break;
        case 'delete':
          this.router.delete(path, roles, handler);
          break;
        case 'option':
          this.router.options(path, roles, handler);
          break;
      }
    });
  }

  getRoutes(): Router {
    return this.router;
  }
}
