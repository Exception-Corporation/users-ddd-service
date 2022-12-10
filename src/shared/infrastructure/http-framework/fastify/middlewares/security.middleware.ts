import { injectable, inject } from 'inversify';
import {
  Request,
  Response
} from '@/shared/infrastructure/http-framework/middlewares/shared/params';
import { TYPES } from '@/shared/infrastructure/d-injection/types';
import { IAuthentication } from '@/shared/domain/auth/authentication.interface';
import {
  SecurityMiddleware,
  MiddlewareResponse
} from '@/shared/domain/middlewares/auth.middleware';
import { DomainError } from '@/shared/domain/errors/lib/DomainError';
import { Logger } from '@/shared/domain/logger';

@injectable()
export class AutorizationRouter
  implements SecurityMiddleware<Request, Response, unknown, any>
{
  constructor(
    @inject(TYPES.Logger) private readonly logger: Logger,
    @inject(TYPES.IAuthentication) private readonly authService: IAuthentication
  ) {}
  /**
   * Validation middleware for authentication in a router
   * @param req
   * @param res
   * @param next
   */
  isAuth(
    roles: Array<string>
  ): MiddlewareResponse<Request, Response, unknown, any> {
    return async (req: Request, res: Response) => {
      if (!roles.length) {
        return;
      }

      if (!req.headers.authorization) {
        return res.status(403).send({
          message: "The request doesn't have the authentication header"
        });
      }

      const token = req.headers.authorization
        .replace(/['"]+/g, '')
        .split(' ')[1];

      try {
        const payload: any = await this.authService.verify(token);

        if (!payload || payload?.error) {
          return res.status(401).send({ message: 'Invalid token' });
        }

        if (!roles.includes(payload?.role))
          return res
            .status(400)
            .send({ success: false, message: 'Permission deneged' });

        if (!req.body) req.body = {};

        (req.body as any)['auth'] = payload;
      } catch (e: any) {
        this.logger.warn(e.toString());

        return res
          .status(400)
          .send(
            e instanceof DomainError
              ? { success: false, message: e.message, type: e.type }
              : { success: false, message: e.toString() }
          );
      }
    };
  }
}
