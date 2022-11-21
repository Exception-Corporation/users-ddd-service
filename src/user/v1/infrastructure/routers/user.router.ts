import { Router } from 'express';
import { RouterC } from '@/shared/infrastructure/router/router.class';
import Controllers from '@/user/v1/infrastructure/controllers';
import { MiddlewareRouter } from '@/shared/infrastructure/middleware/security.middleware';
import { Logger } from '@/shared/domain/logger';
import { ControllerParams } from '@/shared/infrastructure/controller/decorators/controller';
import { RouterD } from '@/shared/infrastructure/router/decorators/router.decorator';

@RouterD({ path: '/api/v1/users', Controllers })
export class UserRouter extends RouterC<Router> {
  private router: Router = Router();
  private authMiddleware: MiddlewareRouter;

  constructor(protected logger: Logger) {
    super(logger);

    this.authMiddleware = new MiddlewareRouter(logger);

    this.router;

    Controllers.forEach(
      (Controller: ControllerParams & { execute: () => any }) => {
        const { path, handler, roles } = {
          path: Controller.path.toString(),
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
      }
    );
  }

  getRoutes(): Router {
    return this.router;
  }
}
