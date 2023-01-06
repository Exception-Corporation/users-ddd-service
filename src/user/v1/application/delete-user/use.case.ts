import { inject, provide } from '@container';
import { TYPES } from '@/user/v1/infrastructure/d-injection/types';
import { UseCase } from '@/shared/infrastructure/use-cases/UseCase';
import { UserRepository } from '@/user/v1/domain/repositories/user.repository';
import {
  Response,
  ResponsePrimitive
} from '@/user/v1/domain/response/response.entity';
import { UserId } from '@/user/v1/domain/user/value-objects/user.id';
import { GlobalFunctions } from '@/shared/infrastructure/utils/global.functions';
import HttpStatus from '@/shared/domain/errors/lib/HttpStatus';

@provide(TYPES.DeleteUserUseCase)
export class DeleteUserUseCase extends UseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository
  ) {
    super();
  }

  async execute(id: UserId): Promise<Response> {
    const userCreated = await this.userRepository.deleteUser(id.valueOf());

    let response: ResponsePrimitive = {
      success: GlobalFunctions.safeVal(userCreated, true, false),
      status: GlobalFunctions.safeVal(
        userCreated,
        HttpStatus.OK,
        HttpStatus.NOT_FOUND
      ),
      contain: GlobalFunctions.safeVal(
        userCreated,
        { message: 'User deleted successfully' },
        { error: HttpStatus.NOT_FOUND, message: 'User not found' }
      )
    };

    return Response.fromPrimitives(
      response.success,
      response.status,
      response.contain
    );
  }
}
