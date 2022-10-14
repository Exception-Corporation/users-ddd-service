import { Router } from "express";
import { RouterC } from "@/shared/domain/class/router.class";
import { UserController } from "@/user/v1/infrastructure/controllers/UserController";

export class UserRouter extends RouterC<Router> {
  private router: Router = Router();
  private path: string;
  private controller: UserController;
  constructor() {
    super();

    this.controller = new UserController();

    this.path = "/api/v1/users";

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
    this.router.put(
      `${this.path}/update/:id`,
      this.controller.update.bind(this.controller)
    );
    this.router.delete(
      `${this.path}/delete/:id`,
      this.controller.remove.bind(this.controller)
    );

    this.router.post(
      `${this.path}/login/`,
      this.controller.login.bind(this.controller)
    );
  }

  getRoutes(): Router {
    return this.router;
  }
}
