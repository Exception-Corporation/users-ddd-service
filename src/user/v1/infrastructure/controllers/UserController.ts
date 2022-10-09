import { Request, Response } from "express";
import { BaseController } from "@/shared/infrastructure/controller/base.controller";
import { User } from "@/user/v1/infrastructure/models/user.entity";

export class UserController extends BaseController {
  constructor() {
    super();
  }

  async all(req: Request, res: Response) {
    try {
      const users = await User.find();
      return res.send(users);
    } catch (error) {
      return this.mapperException(res, error, req.body, [], "Users v1");
    }
  }

  async one(req: Request, res: Response) {
    try {
      const user = await User.findOneBy({ id: Number(req.params.id) });
      return res.send({ user });
    } catch (error) {
      return this.mapperException(res, error, req.body, [], "Users v1");
    }
  }

  async save(req: Request, res: Response) {
    try {
      const user = await User.save(req.body);
      return res.send(user);
    } catch (error) {
      return this.mapperException(res, error, req.body, [], "Users v1");
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const user = await User.findOneBy({ id: Number(id) });
      if (!user) return res.status(404).json({ message: "Not user found" });

      const userUpdated = await User.update({ id: Number(id) }, req.body);

      return res.status(200).send(userUpdated);
    } catch (error) {
      return this.mapperException(res, error, req.body, [], "Users v1");
    }
  }

  async remove(req: Request, res: Response) {
    try {
      let userToRemove = await User.findOneBy({
        id: Number(req.params.id),
      });
      if (userToRemove) await User.remove(userToRemove);

      return res.send("User deleted");
    } catch (error) {
      return this.mapperException(res, error, req.body, [], "Users v1");
    }
  }
}
