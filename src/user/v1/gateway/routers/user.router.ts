import { Request, Response, Router } from 'express';
import { RouterC } from '@/shared/infrastructure/router/router.class';
import Controllers from '@/user/v1/gateway/controllers';
import { Logger } from '@/shared/domain/logger';
import { ControllerClass } from '@/shared/infrastructure/controller/decorators/controller';
import { Routes } from '@/shared/infrastructure/router/decorators/router.decorator';

@Routes({ path: '/api/v1/users', Controllers })
export class UserRouter extends RouterC<Router> {
  private router: Router = Router();

  constructor(protected logger: Logger) {
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
            cookies: req.cookies,
            path: req.path
          };

          const { status, response } = await Controller.execute(context);

          return res.status(status).send(response);
        }
      };

      this.router[Controller.http](path, Controller.middlewares, handler);
    });
  }

  getRoutes(): Router {
    return this.router;
  }
}
