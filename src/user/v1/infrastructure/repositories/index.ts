import { UserPostgreseRepository } from "@/user/v1/infrastructure/repositories/user.postgres.repository";
import { UserRepository as UserInterface } from "@/user/v1/domain/repositories/user.repository";

export const UserRepository: UserInterface =
  UserPostgreseRepository.getInstance();
