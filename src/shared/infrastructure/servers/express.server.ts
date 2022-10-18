import express, {
  Application as app,
  Request,
  Response,
  NextFunction
} from 'express';
import { Server } from '@/shared/domain/interfaces/server.interface';
import { UserRouter } from '@/user/v1/infrastructure/routers/user.router';
import config from '@/shared/infrastructure/config';
import { Logger } from '@/shared/domain/logger';
import { RequireContext } from '@/shared/infrastructure/auto-files/require.context';

export class Application implements Server<app> {
  private app: app;

  constructor(private logger: Logger) {
    this.app = express();
    this.app.use(express.json());
    this.app.use((_req: Request, res: Response, next: NextFunction) => {
      res.header('Acess-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accetp, Access-Control-Allow-Request-Method'
      );
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, DELETE'
      );
      res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

      next();
    });

    this.app.use('/', new UserRouter().getRoutes());
  }

  getApp() {
    return {
      app: this.app,
      initialize: async () => {
        const { project } = config;
        this.app.listen(project.port, () => {
          this.logger.info(
            `Server [Express] listen on port: [${project.host}:${project.port}] in mode: ${project.mode}`
          );
        });
      }
    };
  }

  getRouters() {
    return new RequireContext().getFiles('@/', true, /^((?!!+).)*router.ts$/);
  }
}
