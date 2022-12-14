import { injectable, inject } from 'inversify';
import Fastify, {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
  FastifyError
} from 'fastify';
import fastifyStatic from '@fastify/static';
import rateLimit from '@fastify/rate-limit';
import { TYPES } from '@/shared/infrastructure/d-injection/types';
import { AppContainer } from '@/shared/infrastructure/d-injection/container';
import swagger from '@/shared/infrastructure/http-framework/fastify/open.api';
import { Server } from '@/shared/domain/http-framework/server.interface';
import config from '@/shared/infrastructure/config';
import { Logger } from '@/shared/domain/logger';
import { WatchLogger } from '@/shared/infrastructure/logger/watch.logger';
import { RequireService } from '@/shared/infrastructure/auto-files/';
import { Router } from '@/shared/infrastructure/http-framework/middlewares/shared/router';
import { CacheIO } from '@/shared/domain/cache/cache.io.server';

@injectable()
export class FastifyServer implements Server<FastifyInstance> {
  private app: FastifyInstance;

  constructor(
    @inject(TYPES.Framework) private readonly logger: Logger,
    @inject(TYPES.CacheIO) cacheService: CacheIO
  ) {
    this.app = Fastify({ logger: true });

    // Middleware
    this.app.register(require('@fastify/swagger'), swagger);
    this.app.register(require('@fastify/cors'));

    // rateLimit per IP = max / duration * 1000 [req/s]
    this.app.register(rateLimit, {
      max: config.RateLimit.request,
      timeWindow: config.RateLimit.duration,
      redis: cacheService.getConnection(),
      skipOnError: false
    });

    // Catching downstream errors
    this.app.addHook(
      'onError',
      (req: FastifyRequest, rep: FastifyReply, err: FastifyError) => {
        WatchLogger.registerLog({
          type: 'HTTP_FRAMEWORK',
          message: err.message,
          module: FastifyServer.name,
          level: 'error',
          params: req.body as object
        });
        rep.status(500).send({ message: err.message });
      }
    );

    // Swagger
    const appLayout = require('@/shared/infrastructure/layouts/index.hbs');

    this.app.get('/', (_req: FastifyRequest, rep: FastifyReply) => {
      rep.type('text/html').send(
        appLayout({
          name: config.project.name,
          mode: config.project.mode,
          docs: config.swagger.isPublic === 'true' ? config.swagger.html : false
        })
      );
    });

    // Register tracing
    WatchLogger.registerTracer();

    this.app.register(fastifyStatic, {
      root: `${require('path').resolve()}/src/shared/infrastructure/layouts/`
    });

    //Load routers
    this.getRouters().forEach((Router) => {
      const router: any = AppContainer.resolve(Router);

      router.getRoutes().forEach((route: Router) => {
        route.url = `${router.path}${route.url}`;
        this.app[route.method](
          route.url,
          {
            preHandler: route.middlewares
          },
          route.handler
        );
      });
    });

    this.app.ready((err) => {
      if (err) throw err;
      console.log(
        JSON.stringify((this.app as any).swagger({ exposeRoute: true }))
      );
    });
  }

  async getApp() {
    return {
      app: this.app,
      initialize: async () => {
        const { project } = config;
        this.app.listen({ port: project.port }, () => {
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
