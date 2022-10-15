import { User, UserPrimitive } from "@/user/v1/domain/user/user.aggregate.root";

export interface UserRepository {
  saveUser(user: UserPrimitive): Promise<User>;
  deleteUser(id: number): Promise<boolean>;
  updateUser(user: UserPrimitive, currentPassword: string): Promise<boolean>;
  findAll(): Promise<Array<User>>;
  findById(id: number): Promise<User | null>;
  getUserByLogin(
    { username, email }: { username?: string; email?: string },
    password: string
  ): Promise<User>;
}