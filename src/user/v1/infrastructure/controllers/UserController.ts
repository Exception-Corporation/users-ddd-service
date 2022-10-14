import { Request, Response } from "express";
import { BaseController } from "@/shared/infrastructure/controller/base.controller";
import { User } from "@/user/v1/infrastructure/models/user.entity";
import { EncryptionService } from "@/shared/infrastructure/encryption";

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
      const user = await User.save({
        ...req.body,
        password: await EncryptionService.encrypt(req.body.password, 10),
      });
      return res.send(user);
    } catch (error) {
      return this.mapperException(res, error, req.body, [], "Users v1");
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    if (req.body.password)
      req.body.password = await EncryptionService.encrypt(
        req.body.password,
        10
      );

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

      return res.status(200).send({ message: "User deleted" });
    } catch (error) {
      return this.mapperException(res, error, req.body, [], "Users v1");
    }
  }

  async login(req: Request, res: Response) {
    const userFound = await User.findOneBy({ email: req.body.email });
    if (!userFound) return res.status(404).send({ message: "User not found" });
    const verifyPassword = await EncryptionService.verifyEncrypValues(
      req.body.password,
      userFound.password
    );

    if (!verifyPassword)
      return res.status(400).send({ message: "Invalid credentials" });

    return res.status(200).send({ user: userFound });
  }
}
