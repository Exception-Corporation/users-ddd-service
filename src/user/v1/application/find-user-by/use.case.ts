import { UseCase } from "@/shared/infrastructure/use-cases/UseCase";
import { UserRepository } from "@/user/v1/domain/repositories/user.repository";
import {
  Response,
  ResponsePrimitive,
} from "@/user/v1/domain/response/response.entity";
import { UserId } from "@/user/v1/domain/user/value-objects/user.id";
import { UserNotFound } from "@/shared/domain/errors/domain-errors/UserNotFound";

export class FindUserUseCase extends UseCase {
  private static instance: FindUserUseCase | undefined;
  constructor(private userRepository: UserRepository) {
    super();
  }

  static getInstance(userRepository: UserRepository) {
    if (!this.instance) {
      this.instance = new FindUserUseCase(userRepository);
    }

    return this.instance;
  }

  async execute(id: UserId): Promise<Response> {
    const primitiveId = id.valueOf();
    const user = await this.userRepository.findById(primitiveId);

    if (!user) throw new UserNotFound("id", primitiveId);

    let response: ResponsePrimitive = {
      success: true,
      status: 200,
      contain: {
        user: user.toPrimitives(),
      },
    };

    return Response.fromPrimitives(
      response.success,
      response.status,
      response.contain
    );
  }
}
