import { UseCase } from "@/shared/infrastructure/use-cases/UseCase";
import { UserRepository } from "@/user/v1/domain/repositories/user.repository";
import {
  Response,
  ResponsePrimitive,
} from "@/user/v1/domain/response/response.entity";
import { UserId } from "@/user/v1/domain/user/value-objects/user.id";
import { GlobalFunctions } from "@/shared/infrastructure/utils/global.functions";

export class DeleteUserUseCase extends UseCase {
  private static instance: DeleteUserUseCase | undefined;
  constructor(private userRepository: UserRepository) {
    super();
  }

  static getInstance(userRepository: UserRepository) {
    if (!this.instance) {
      this.instance = new DeleteUserUseCase(userRepository);
    }

    return this.instance;
  }

  async execute(id: UserId): Promise<Response> {
    const userCreated = await this.userRepository.deleteUser(id.valueOf());

    let response: ResponsePrimitive = {
      success: GlobalFunctions.safeVal(userCreated, true, false),
      status: GlobalFunctions.safeVal(userCreated, 200, 404),
      contain: GlobalFunctions.safeVal(
        userCreated,
        { message: "User deleted successfully" },
        { error: 404, message: "User not found" }
      ),
    };

    return Response.fromPrimitives(
      response.success,
      response.status,
      response.contain
    );
  }
}
