import { Router } from "express";
import { RouterC } from "@/shared/domain/class/router.class";
import { UserController } from "@/user/v1/infrastructure/controllers/UserController";
import { MiddlewareRouter } from "@/shared/infrastructure/middleware/security.middleware";

export class UserRouter extends RouterC<Router> {
  private router: Router = Router();
  private path: string;
  private controller: UserController;
  private authMiddleware: MiddlewareRouter;
  constructor() {
    super();

    this.controller = new UserController();

    this.authMiddleware = new MiddlewareRouter();

    this.path = "/api/v1/users";

    //SIMPLE CRUD
    this.router.get(
      `${this.path}/getAll`,
      this.controller.all.bind(this.controller)
    );
    this.router.get(
      `${this.path}/get/:id`,
      this.controller.one.bind(this.controller)
    );
    this.router.post(
      `${this.path}`,
      this.controller.save.bind(this.controller)
    );

    //WITH AUTH (TOKEN)
    this.router.put(
      `${this.path}/update/:id`,
      this.authMiddleware.isAuth(["standard", "root"]) as any,
      this.controller.update.bind(this.controller)
    );
    this.router.delete(
      `${this.path}/delete/:id`,
      this.authMiddleware.isAuth(["standard", "root"]) as any,
      this.controller.remove.bind(this.controller)
    );

    //COMPLEX SERVICES
    this.router.post(
      `${this.path}/login/`,
      this.controller.login.bind(this.controller)
    );
  }

  getRoutes(): Router {
    return this.router;
  }
}
