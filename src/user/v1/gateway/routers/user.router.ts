import { inject, injectable } from 'inversify';
import { RouterC } from '@/shared/infrastructure/router/router.class';
import Controllers from '@/user/v1/gateway/controllers';
import { Logger } from '@/shared/domain/logger';
import { ControllerClass } from '@/shared/infrastructure/controller/decorators/controller';
import { Routes } from '@/shared/infrastructure/router/decorators/router.decorator';
import { TYPES } from '@/shared/infrastructure/d-injection/types';
import { Router } from '@/shared/infrastructure/http-framework/middlewares/shared/router';
import {
  Request,
  Response
} from '@/shared/infrastructure/http-framework/middlewares/shared/params';

@Routes({ path: '/api/v1/users', Controllers })
@injectable()
export class UserRouter extends RouterC<Array<Router>> {
  private router: Array<Router> = [];

  constructor(@inject(TYPES.Logger) protected logger: Logger) {
    super(logger);

    this.router;

    Controllers.forEach((Controller: ControllerClass) => {
      const { path, handler } = {
        path: Controller.path.toString(),
        handler: async (req: Request, res: Response) => {
          const context = {
            body: req.body,
            params: req.params,
            query: req.query,
            headers: req.headers,
            cookies: {},
            path: (req as any)?.path || (req as any)?.routerPath
          };

          const { status, response } = await Controller.execute(context);

          return res.status(status).send(response);
        }
      };

      this.router.push({
        method: Controller.http,
        url: path,
        schema: {},
        middlewares: Controller.middlewares,
        handler
      });
    });
  }

  getRoutes(): Array<Router> {
    return this.router;
  }
}
