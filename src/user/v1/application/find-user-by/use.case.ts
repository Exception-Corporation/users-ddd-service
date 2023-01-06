import { inject, provide } from '@container';
import { TYPES } from '@/user/v1/infrastructure/d-injection/types';
import { UseCase } from '@/shared/infrastructure/use-cases/UseCase';
import { UserRepository } from '@/user/v1/domain/repositories/user.repository';
import {
  Response,
  ResponsePrimitive
} from '@/user/v1/domain/response/response.entity';
import { UserId } from '@/user/v1/domain/user/value-objects/user.id';
import { UserNotFound } from '@/shared/domain/errors/domain-errors/UserNotFound';
import HttpStatus from '@/shared/domain/errors/lib/HttpStatus';

@provide(TYPES.FindUserUseCase)
export class FindUserUseCase extends UseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository
  ) {
    super();
  }

  async execute(id: UserId): Promise<Response> {
    const user = await this.getUserToUpdate(id);

    let response: ResponsePrimitive = {
      success: true,
      status: HttpStatus.OK,
      contain: {
        user: user.toPrimitives()
      }
    };

    return Response.fromPrimitives(
      response.success,
      response.status,
      response.contain
    );
  }

  async getUserToUpdate(id: UserId) {
    const primitiveId = id.valueOf();
    const user = await this.userRepository.findById(primitiveId);

    if (!user) throw new UserNotFound('id', primitiveId);

    return user;
  }
}
