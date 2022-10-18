import { UseCase } from '@/shared/infrastructure/use-cases/UseCase';
import { UserRepository } from '@/user/v1/domain/repositories/user.repository';
import {
  Response,
  ResponsePrimitive
} from '@/user/v1/domain/response/response.entity';
import { UserPassword } from '@/user/v1/domain/user/value-objects/user.password';
import { UserEmail } from '@/user/v1/domain/user/value-objects/user.email';
import { UserUsername } from '@/user/v1/domain/user/value-objects/user.username';
import { AuthenticationService } from '@/shared/infrastructure/auth';
import { GlobalFunctions } from '@/shared/infrastructure/utils/global.functions';
import { UserPrimitive } from '@/user/v1/domain/user/user.aggregate.root';

export class LoginUserUseCase extends UseCase {
  private static instance: LoginUserUseCase | undefined;
  constructor(private userRepository: UserRepository) {
    super();
  }

  static getInstance(userRepository: UserRepository) {
    if (!this.instance) {
      this.instance = new LoginUserUseCase(userRepository);
    }

    return this.instance;
  }

  async execute(
    { email, username }: { email?: UserEmail; username?: UserUsername },
    password: UserPassword
  ): Promise<Response> {
    const user = await this.userRepository.getUserByLogin(
      {
        email: email ? email.valueOf() : undefined,
        username: username ? username.valueOf() : undefined
      },
      password.valueOf()
    );

    const access_token = await AuthenticationService.sign(
      GlobalFunctions.getNewParams<UserPrimitive>(user.toPrimitives(), [
        'createdAt',
        'updatedAt',
        'password',
        'id',
        'active'
      ])
    );

    let response: ResponsePrimitive = {
      success: true,
      status: 200,
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
