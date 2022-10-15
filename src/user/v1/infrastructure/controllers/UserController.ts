import { Request, Response } from "express";
import { BaseController } from "@/shared/infrastructure/controller/base.controller";
import { User } from "@/user/v1/infrastructure/models/user.entity";
import { EncryptionService } from "@/shared/infrastructure/encryption";
import { RequestAdapter } from "@/user/v1/infrastructure/adapters/";
import { CreateUserDTO } from "@/user/v1/infrastructure/dtos/create.user.dto";
import { LoginUserDTO } from "@/user/v1/infrastructure/dtos/login.user.dto";

export class UserController extends BaseController {
  constructor() {
    super();
  }

  async all(req: Request, res: Response) {
    try {
      const users = await User.find();
      return res.send(users);
    } catch (error: any) {
      return this.mapperException(res, error, req.body, "Users v1");
    }
  }

  async one(req: Request, res: Response) {
    try {
      const user = await User.findOneBy({ id: Number(req.params.id) });
      return res.status(200).send({ user });
    } catch (error: any) {
      return this.mapperException(res, error, req.body, "Users v1");
    }
  }

  async save(req: Request, res: Response) {
    try {
      const userToCreate: CreateUserDTO =
        await RequestAdapter.build<CreateUserDTO>(req.body.user, [
          "firstname",
          "lastname",
          "username",
          "email",
          "password",
        ]);

      const user = await User.save({
        ...userToCreate,
        password: await EncryptionService.encrypt(userToCreate.password, 10),
      });
      return res.status(200).send({ user });
    } catch (error: any) {
      return this.mapperException(res, error, req.body, "Users v1");
    }
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params?.id);
    const userToUpdate: Partial<CreateUserDTO> = req.body.user;

    if (userToUpdate.password)
      userToUpdate.password = await EncryptionService.encrypt(
        userToUpdate.password,
        10
      );

    try {
      const user = await User.findOneBy({ id });
      if (!user) return res.status(404).json({ message: "Not user found" });

      const userUpdated = await User.update({ id }, userToUpdate);

      return res.status(200).send(userUpdated);
    } catch (error: any) {
      return this.mapperException(res, error, req.body, "Users v1");
    }
  }

  async remove(req: Request, res: Response) {
    try {
      let userToRemove = await User.findOneBy({
        id: Number(req.params.id),
      });
      if (userToRemove) await User.remove(userToRemove);

      return res.status(200).send({ message: "User deleted" });
    } catch (error: any) {
      return this.mapperException(res, error, req.body, "Users v1");
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password }: LoginUserDTO =
        await RequestAdapter.build<LoginUserDTO>(req.body.user, [
          "email",
          "password",
        ]);

      const userFound = await User.findOneBy({ email: email });

      if (!userFound)
        return res.status(404).send({ message: "User not found" });

      const verifyPassword = await EncryptionService.verifyEncrypValues(
        password,
        userFound.password
      );

      if (!verifyPassword)
        return res.status(400).send({ message: "Invalid credentials" });

      return res.status(200).send({ user: userFound });
    } catch (error: any) {
      return this.mapperException(res, error, req.body, "Users v1");
    }
  }
}
