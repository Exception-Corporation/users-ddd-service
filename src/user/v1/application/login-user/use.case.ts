import { inject, provide } from '@container';
import { TYPES } from '@/user/v1/infrastructure/d-injection/types';
import { TYPES as TYPES_SHARED } from '@/shared/infrastructure/d-injection/types';
import { UseCase } from '@/shared/infrastructure/use-cases/UseCase';
import { UserRepository } from '@/user/v1/domain/repositories/user.repository';
import {
  Response,
  ResponsePrimitive
} from '@/user/v1/domain/response/response.entity';
import { UserPassword } from '@/user/v1/domain/user/value-objects/user.password';
import { UserEmail } from '@/user/v1/domain/user/value-objects/user.email';
import { UserUsername } from '@/user/v1/domain/user/value-objects/user.username';
import { IAuthentication } from '@/shared/domain/auth/authentication.interface';
import HttpStatus from '@/shared/domain/errors/lib/HttpStatus';

@provide(TYPES.LoginUserUseCase)
export class LoginUserUseCase extends UseCase {
  constructor(
    @inject(TYPES_SHARED.IAuthentication)
    private readonly authenticationService: IAuthentication,
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository
  ) {
    super();
  }

  async execute(
    { email, username }: { email?: UserEmail; username?: UserUsername },
    password: UserPassword
  ): Promise<Response> {
    const user = await this.userRepository.getUserByLogin(
      {
        email: email?.valueOf(),
        username: username?.valueOf()
      },
      password.valueOf()
    );

    const access_token = await this.authenticationService.sign(
      user.toPrimitives(),
      ['createdAt', 'updatedAt', 'password', 'active']
    );

    let response: ResponsePrimitive = {
      success: true,
      status: HttpStatus.OK,
      contain: {
        access_token
      }
    };

    return Response.fromPrimitives(
      response.success,
      response.status,
      response.contain
    );
  }
}
