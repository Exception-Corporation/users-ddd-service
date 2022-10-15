import { NextFunction, Request, Response } from "express";
import { AuthenticationService } from "@/shared/infrastructure/auth";
import {
  SecurityMiddleware,
  MiddlewareResponse,
} from "@/shared/domain/middlewares/auth.middleware";

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
      if (!req.headers.authorization) {
        return res.status(403).send({
          message: "The request doesn't have the authentication header",
        });
      }

      var token = req.headers.authorization.replace(/['"]+/g, "").split(" ")[1];

      try {
        var payload: any = await AuthenticationService.verify(token);

        if (!payload || payload?.error) {
          return res.status(401).send({ message: "Invalid token" });
        }

        if (!roles.includes(payload?.role))
          return res
            .status(400)
            .send({ success: false, message: "Permission deneged" });
      } catch (ex) {
        console.info(ex, roles);
        return res.status(400).send({ message: "Invalid token" });
      }

      next();
    };
  }
}
