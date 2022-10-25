import { NextFunction, Request, Response } from 'express';
import { AuthenticationService } from '@/shared/infrastructure/auth';
import {
  SecurityMiddleware,
  MiddlewareResponse
} from '@/shared/domain/middlewares/auth.middleware';
import { DomainError } from '@/shared/domain/errors/lib/DomainError';
import { MainLogger } from '../logger/main';

export class MiddlewareRouter
  implements SecurityMiddleware<Request, Response, NextFunction, any>
{
  constructor() {}
  /**
   * Validation middleware for authentication in a router
   * @param req
   * @param res
   * @param next
   */
  isAuth(
    roles: Array<string>
  ): MiddlewareResponse<Request, Response, NextFunction, any> {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (!roles.length) {
        return next();
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
        const payload: any = await AuthenticationService.verify(token);

        if (!payload || payload?.error) {
          return res.status(401).send({ message: 'Invalid token' });
        }

        if (!roles.includes(payload?.role))
          return res
            .status(400)
            .send({ success: false, message: 'Permission deneged' });

        req.body['auth'] = payload;
      } catch (e: any) {
        MainLogger.warn(e.toString());

        return res
          .status(400)
          .send(
            e instanceof DomainError
              ? { success: false, message: e.message, type: e.type }
              : { success: false, message: e.toString() }
          );
      }

      next();
    };
  }
}
