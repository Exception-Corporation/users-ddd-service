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
import HttpStatus from '@/shared/domain/errors/lib/HttpStatus';

@provide(TYPES.CreateUserUseCase)
export class CreateUserUseCase extends UseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository
  ) {
    super();
  }

  async execute(user: User): Promise<Response> {
    const userCreated = await this.userRepository.saveUser(
      user.toPrimitives() as UserPrimitive
    );

    let response: ResponsePrimitive = {
      success: true,
      status: HttpStatus.OK,
      contain: {
        user: userCreated.toPrimitives()
      }
    };

    return Response.fromPrimitives(
      response.success,
      response.status,
      response.contain
    );
  }
}
