import { Router } from 'express';
import { RouterC } from '@/shared/domain/class/router.class';
import Controllers from '@/user/v1/infrastructure/controllers';
import { MiddlewareRouter } from '@/shared/infrastructure/middleware/security.middleware';
import { GlobalFunctions } from '@/shared/infrastructure/utils/global.functions';
import { Logger } from '@/shared/domain/logger';

export class UserRouter extends RouterC<Router> {
  private router: Router = Router();
  private path: string;
  private authMiddleware: MiddlewareRouter;
  constructor(protected logger: Logger) {
    super(logger);

    this.authMiddleware = new MiddlewareRouter();

    this.path = '/api/v1/users';
    this.router;

    GlobalFunctions.verifyDuplicationValues(Controllers, ['http', 'path']);

    this.logger.info(`\n\x1b[32m [ROUTER]: ${UserRouter.name} \x1b[0m\n`);

    const routes: Array<any> = [];

    Controllers.forEach((Controller) => {
      const { path, handler, roles } = {
        path: `${this.path}${Controller.path.toString()}`,
        handler: Controller.execute.bind(Controller),
        roles: this.authMiddleware.isAuth(Controller.roles || [])
      };

      routes.push({
        HTTP: Controller.http.toUpperCase(),
        ENDPOINT: path,
        AUTHENITCATION: Boolean(Controller.roles?.length),
        ROLES: Controller.roles
      });

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

    this.logger.table(routes);
  }

  getRoutes(): Router {
    return this.router;
  }
}
