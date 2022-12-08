import { inject } from 'inversify';
import { provide } from '@/shared/infrastructure/d-injection/decorators/provider';
import { TYPES } from '@/user/v1/infrastructure/d-injection/types';
import { UseCase } from '@/shared/infrastructure/use-cases/UseCase';
import { UserRepository } from '@/user/v1/domain/repositories/user.repository';
import {
  Response,
  ResponsePrimitive
} from '@/user/v1/domain/response/response.entity';
import { User, UserPrimitive } from '@/user/v1/domain/user/user.aggregate.root';
import { UserPassword } from '@/user/v1/domain/user/value-objects/user.password';
import { GlobalFunctions } from '@/shared/infrastructure/utils/global.functions';

@provide(TYPES.UpdateUserUseCase)
export class UpdateUserUseCase extends UseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository
  ) {
    super();
  }

  async execute(user: User, currentPassword: UserPassword): Promise<Response> {
    const userCreated = await this.userRepository.updateUser(
      user.toPrimitives() as UserPrimitive,
      currentPassword.valueOf()
    );

    let response: ResponsePrimitive = {
      success: GlobalFunctions.safeVal(userCreated, true, false),
      status: GlobalFunctions.safeVal(userCreated, 200, 404),
      contain: GlobalFunctions.safeVal(
        userCreated,
        { message: 'User updated successfully' },
        {
          error: 404,
          message:
            'Something went wrong trying to update the user, please try again'
        }
      )
    };

    return Response.fromPrimitives(
      response.success,
      response.status,
      response.contain
    );
  }
}
