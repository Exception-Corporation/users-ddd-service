import { Request, Response } from "express";
import { User } from "../models/user.entity";

export class UserController {
  private constructor() {}

  static async all(request: Request, response: Response) {
    try {
      return User.find();
    } catch (error) {
      console.info(error);
      return response.send(error);
    }
  }

  static async one(request: Request, response: Response) {
    try {
      return User.findOne(request.params.id as any);
    } catch (error) {
      console.info(error);
      return response.send(error);
    }
  }

  static async save(request: Request, response: Response) {
    try {
      return User.save(request.body);
    } catch (error) {
      console.info(error);
      return response.send(error);
    }
  }

  static async remove(request: Request, response: Response) {
    try {
      let userToRemove = await User.findOneBy({
        id: request.params.id as any,
      });
      if (userToRemove) await User.remove(userToRemove);
    } catch (error) {
      console.info(error);
      return response.send(error);
    }
  }
}
