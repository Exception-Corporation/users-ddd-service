import { injectable, inject } from 'inversify';
import { TYPES } from '@/shared/infrastructure/d-injection/types';
import { AppContainer } from '@/shared/infrastructure/d-injection/container';
import express, { Application as app } from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import morgan from 'morgan';
import { Server } from '@/shared/domain/http-framework/server.interface';
import config from '@/shared/infrastructure/config';
import { Logger } from '@/shared/domain/logger';
import { RequireService } from '@/shared/infrastructure/auto-files/';

@injectable()
export class ExpressServer implements Server<app> {
  private app: app;

  constructor(@inject(TYPES.Framework) private readonly logger: Logger) {
    this.app = express();

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
    this.app.use(morgan('dev'));

    const apiLimiter = rateLimit({
      windowMs: config.RateLimit.duration,
      max: config.RateLimit.request,
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false // Disable the `X-RateLimit-*` headers
    });

    this.app.use('/', apiLimiter);

    this.getRouters().forEach((Router) => {
      const router: any = AppContainer.resolve(Router);
      this.app.use(router.path, router.getRoutes());
    });
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

  getRouters(): Array<any> {
    return RequireService.getFiles(
      require.context('@/*', true, /^((?!!+).)*router.ts$/),
      ['path']
    );
  }
}
