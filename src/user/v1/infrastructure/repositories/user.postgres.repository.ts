import { UserRepository } from "@/user/v1/domain/repositories/user.repository";
import { User, UserPrimitive } from "@/user/v1/domain/user/user.aggregate.root";
import { User as UserModel } from "@/user/v1/infrastructure/models/user.entity";
import { EncryptionService } from "@/shared/infrastructure/encryption";
import { UserNotFound } from "@/shared/domain/errors/domain-errors/UserNotFound";
import { InvalidCredentials } from "@/shared/domain/errors/domain-errors/InvalidCredentials";
import { DatabaseError } from "@/shared/domain/errors/domain-errors/DatabaseError";
import { DomainError } from "@/shared/domain/errors/lib/DomainError";
import { GlobalFunctions } from "@/shared/infrastructure/utils/global.functions";

export class UserPostgreseRepository implements UserRepository {
  async saveUser(user: Partial<UserPrimitive>): Promise<User> {
    try {
      user.password = await EncryptionService.encrypt(user.password!, 2);
      user = GlobalFunctions.getNewParams<UserPrimitive>(user, [
        "id",
        "createdAt",
        "updatedAt",
      ]);

      const userSaved = (await UserModel.save(user)) as UserPrimitive<Date>;

      return User.fromPrimitives(userSaved);
    } catch (error: any) {
      throw new DatabaseError(error.toString());
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const userDeleted = await UserModel.delete({ id });

      return !!userDeleted.affected;
    } catch (error: any) {
      throw new DatabaseError(error.toString());
    }
  }

  async getUserByLogin(
    { username, email }: { username?: string; email?: string },
    password: string
  ): Promise<User> {
    try {
      let userFound: UserModel | null = null;
      let userNotFound: { property?: string; value?: string } = {};

      const finding = async (property: string, value: string) => {
        userNotFound = { property, value };
        return await UserModel.findOneBy({ [property]: value });
      };

      if (username) userFound = await finding("username", username);
      if (email && !userFound) userFound = await finding("email", email);

      if (!userFound)
        throw new UserNotFound(userNotFound.property!, userNotFound.value!);

      const verifyPassword = await EncryptionService.verifyEncrypValues(
        password,
        userFound.password
      );

      if (!verifyPassword) throw new InvalidCredentials();

      return User.fromPrimitives(userFound);
    } catch (error: any) {
      if (error instanceof DomainError) throw error;
      throw new DatabaseError(error.toString());
    }
  }

  async updateUser(
    user: Partial<UserPrimitive>,
    currentPassword: string
  ): Promise<boolean> {
    try {
      if (currentPassword == user.password) delete user.password;
      if (user.password)
        user.password = await EncryptionService.encrypt(user.password, 2);
      user = GlobalFunctions.getNewParams<UserPrimitive>(user, [
        "createdAt",
        "updatedAt",
      ]);

      const userUpdated = await UserModel.update({ id: user.id }, user);

      return !!userUpdated.affected;
    } catch (error: any) {
      if (error instanceof DomainError) throw error;
      throw new DatabaseError(error.toString());
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users: Array<UserPrimitive<Date>> = await UserModel.find();

      return users.map(User.fromPrimitives);
    } catch (error: any) {
      throw new DatabaseError(error.toString());
    }
  }

  async findById(userId: number): Promise<User | null> {
    try {
      const userFound: UserPrimitive<Date> | null = await UserModel.findOneBy({
        id: userId,
      });

      return !userFound ? null : User.fromPrimitives(userFound);
    } catch (error: any) {
      if (error instanceof DomainError) throw error;
      throw new DatabaseError(error.toString());
    }
  }
}
