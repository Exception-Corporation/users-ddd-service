import express, { Application as app } from 'express';
import cors from 'cors';
import { Server } from '@/shared/domain/interfaces/server.interface';
import config from '@/shared/infrastructure/config';
import { Logger } from '@/shared/domain/logger';
import { RequireService } from '@/shared/infrastructure/auto-files/';

export class Application implements Server<app> {
  private app: app;

  constructor(private logger: Logger) {
    this.app = express();

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());

    this.getRouters().forEach((Router) => {
      const router = new Router(this.logger);
      if (router.path !== undefined)
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
    return RequireService.getFiles('src/**/*.router.ts');
  }
}
