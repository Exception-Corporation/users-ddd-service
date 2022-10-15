import { Request, Response } from "express";
import { BaseController } from "@/shared/infrastructure/controller/base.controller";
import { RequestAdapter } from "@/user/v1/infrastructure/adapters/";
import { CreateUserDTO } from "@/user/v1/infrastructure/dtos/create.user.dto";
import { LoginUserDTO } from "@/user/v1/infrastructure/dtos/login.user.dto";
import { UserRepository } from "@/user/v1/infrastructure/repositories";
import { UserId } from "@/user/v1/domain/user/value-objects/user.id";
import { User, UserPrimitive } from "@/user/v1/domain/user/user.aggregate.root";
import { UserNotFound } from "@/shared/domain/errors/domain-errors/UserNotFound";
import { DTOPropertiesError } from "@/shared/domain/errors/domain-errors/DTOPropertiesError";
import { UserEmail } from "@/user/v1/domain/user/value-objects/user.email";
import { UserUsername } from "@/user/v1/domain/user/value-objects/user.username";
import { UserPassword } from "@/user/v1/domain/user/value-objects/user.password";
import { AuthenticationService } from "@/shared/infrastructure/auth";
import { GlobalFunctions } from "@/shared/infrastructure/utils/global.functions";

export class UserController extends BaseController {
  constructor() {
    super();
  }

  async all(req: Request, res: Response) {
    try {
      const users = await UserRepository.findAll();
      return res.send(users.map((user) => user.toPrimitives()));
    } catch (error: any) {
      return this.mapperException(res, error, req.body, "Users v1");
    }
  }

  async one(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const user = await UserRepository.findById(
        new UserId(Number(id)).valueOf()
      );

      if (!user) throw new UserNotFound("id", id);

      return res.status(200).send({ user: user.toPrimitives() });
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
          "age",
          "role",
          "password",
        ]);

      const user = await UserRepository.saveUser(
        User.fromPrimitives({
          ...userToCreate,
          id: 0,
          createdAt: Date.now().toString(),
          updatedAt: Date.now().toString(),
          active: true,
        }).toPrimitives() as UserPrimitive
      );

      return res.status(200).send({ user: user.toPrimitives() });
    } catch (error: any) {
      return this.mapperException(res, error, req.body, "Users v1");
    }
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);

    const userDTO = req.body.user;

    try {
      if (!userDTO) throw new DTOPropertiesError(["user"]);

      const userTo: Partial<CreateUserDTO & { active?: boolean }> = userDTO;

      const userFound = await UserRepository.findById(
        new UserId(Number(req.params.id)).valueOf()
      );
      if (!userFound) throw new UserNotFound("id", id);

      const userPrimitive = userFound.toPrimitives();
      console.info(userPrimitive);

      const user = await UserRepository.updateUser(
        User.fromPrimitives({
          id: id,
          createdAt: Date.now().toString(),
          updatedAt: Date.now().toString(),
          active: userTo.active || userPrimitive.active,
          age: userTo.age || userPrimitive.age,
          firstname: userTo.firstname || userPrimitive.firstname,
          lastname: userTo.lastname || userPrimitive.lastname,
          username: userTo.username || userPrimitive.username,
          email: userTo.email || userPrimitive.email,
          password: userTo.password || userPrimitive.password,
          role: userTo.role || userPrimitive.role,
        }).toPrimitives() as UserPrimitive,
        userPrimitive.password
      );

      if (user) return res.status(200).send({ message: "User updated" });

      return res.status(400).send({
        message:
          "Something went wrong trying to update the user, please try again",
      });
    } catch (error: any) {
      return this.mapperException(res, error, req.body, "Users v1");
    }
  }

  async remove(req: Request, res: Response) {
    try {
      let result = await UserRepository.deleteUser(
        new UserId(Number(req.params.id)).valueOf()
      );

      if (result) return res.status(200).send({ message: "User deleted" });

      return res.status(400).send({
        message:
          "Something went wrong trying to delete the user, please try again",
      });
    } catch (error: any) {
      return this.mapperException(res, error, req.body, "Users v1");
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, username, password }: LoginUserDTO =
        await RequestAdapter.build<LoginUserDTO>(req.body.user, [
          "password",
          "OR:email,username",
        ]);

      const userFound = await UserRepository.getUserByLogin(
        {
          email: email ? new UserEmail(email).valueOf() : undefined,
          username: username ? new UserUsername(username).valueOf() : undefined,
        },
        new UserPassword(password).valueOf()
      );

      const token = await AuthenticationService.sign(
        GlobalFunctions.getNewParams<UserPrimitive>(userFound.toPrimitives(), [
          "createdAt",
          "updatedAt",
          "password",
          "id",
          "active",
        ])
      );

      return res.status(200).send({ access_token: token });
    } catch (error: any) {
      return this.mapperException(res, error, req.body, "Users v1");
    }
  }
}
