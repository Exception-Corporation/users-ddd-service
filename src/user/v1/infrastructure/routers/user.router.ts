import { Router } from "express";
import { RouterC } from "../../../../shared/domain/class/router.class";
import { UserController } from "../controllers/UserController";

export class UserRouter extends RouterC<Router> {
  private router: Router = Router();
  private path: string;
  constructor() {
    super();

    this.path = "/api/v1/users";

    this.router.get(`${this.path}/getAll`, UserController.all);
    this.router.get(`${this.path}/get/:id`, UserController.one);
    this.router.post(`${this.path}`, UserController.save);
    this.router.put(`${this.path}/update/:id`, UserController.update);
    this.router.delete(`${this.path}/delete/:id`, UserController.remove);
  }

  getRoutes(): Router {
    return this.router;
  }
}
