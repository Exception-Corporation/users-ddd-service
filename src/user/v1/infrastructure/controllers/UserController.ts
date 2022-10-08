import { Request, Response } from "express";
import { User } from "../models/user.entity";

export class UserController {
  private constructor() {}

  static async all(request: Request, response: Response) {
    try {
      const users = await User.find();
      return response.send(users);
    } catch (error) {
      console.info(error);
      return response.send(error);
    }
  }

  static async one(request: Request, response: Response) {
    try {
      const user = await User.findOneBy({ id: Number(request.params.id) });
      return response.send({ user });
    } catch (error) {
      console.info(error);
      return response.send(error);
    }
  }

  static async save(request: Request, response: Response) {
    try {
      const user = await User.save(request.body);
      return response.send(user);
    } catch (error) {
      console.info(error);
      return response.send(error);
    }
  }

  static async remove(request: Request, response: Response) {
    try {
      let userToRemove = await User.findOneBy({
        id: Number(request.params.id),
      });
      if (userToRemove) await User.remove(userToRemove);

      return response.send("User deleted");
    } catch (error) {
      console.info(error);
      return response.send(error);
    }
  }
}
