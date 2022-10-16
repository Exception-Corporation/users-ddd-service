import { UseCase } from "@/shared/infrastructure/use-cases/UseCase";
import { UserRepository } from "@/user/v1/domain/repositories/user.repository";
import {
  Response,
  ResponsePrimitive,
} from "@/user/v1/domain/response/response.entity";
import { User, UserPrimitive } from "@/user/v1/domain/user/user.aggregate.root";

export class CreateUserUseCase extends UseCase {
  private static instance: CreateUserUseCase | undefined;
  constructor(private userRepository: UserRepository) {
    super();
  }

  static getInstance(userRepository: UserRepository) {
    if (!this.instance) {
      this.instance = new CreateUserUseCase(userRepository);
    }

    return this.instance;
  }

  async execute(user: User): Promise<Response> {
    const userCreated = await this.userRepository.saveUser(
      user.toPrimitives() as UserPrimitive
    );

    let response: ResponsePrimitive = {
      success: true,
      status: 200,
      contain: {
        user: userCreated.toPrimitives(),
      },
    };

    return Response.fromPrimitives(
      response.success,
      response.status,
      response.contain
    );
  }
}
