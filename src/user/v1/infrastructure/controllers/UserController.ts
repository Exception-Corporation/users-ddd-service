import { Request, Response } from "express";
import { User } from "../models/user.entity";

export class UserController {
  private constructor() {}

  static async all(_req: Request, res: Response) {
    try {
      const users = await User.find();
      return res.send(users);
    } catch (error) {
      console.info(error);
      return res.send(error);
    }
  }

  static async one(req: Request, res: Response) {
    try {
      const user = await User.findOneBy({ id: Number(req.params.id) });
      return res.send({ user });
    } catch (error) {
      console.info(error);
      return res.send(error);
    }
  }

  static async save(req: Request, res: Response) {
    try {
      const user = await User.save(req.body);
      return res.send(user);
    } catch (error) {
      console.info(error);
      return res.send(error);
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const user = await User.findOneBy({ id: parseInt(id) });
      if (!user) return res.status(404).json({ message: "Not user found" });

      const userUpdated = await User.update({ id: parseInt(id) }, req.body);

      return res.status(200).send(userUpdated);
    } catch (error) {
      console.info(error);
      return res.status(500).json({ message: error });
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      let userToRemove = await User.findOneBy({
        id: Number(req.params.id),
      });
      if (userToRemove) await User.remove(userToRemove);

      return res.send("User deleted");
    } catch (error) {
      console.info(error);
      return res.send(error);
    }
  }
}
