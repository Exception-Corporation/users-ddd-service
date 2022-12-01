import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { RequestAdapter } from '@/user/v1/infrastructure/adapters/';
import { LoginUserDTO } from '@/user/v1/gateway/dtos/login.user.dto';
import { UserRepository } from '@/user/v1/infrastructure/repositories';
import { UserEmail } from '@/user/v1/domain/user/value-objects/user.email';
import { UserUsername } from '@/user/v1/domain/user/value-objects/user.username';
import { UserPassword } from '@/user/v1/domain/user/value-objects/user.password';
import { LoginUserUseCase } from '@/user/v1/application/login-user/use.case';
import { AuthenticationService } from '@/shared/infrastructure/auth';
import {
  Context,
  Controller
} from '@/shared/infrastructure/controller/decorators/controller';

@Controller({
  http: 'post',
  path: '/login/'
})
export class UserLoginController extends BaseController {
  constructor() {
    super();
  }

  async execute(ctx: Context) {
    try {
      const { email, username, password }: LoginUserDTO =
        await RequestAdapter.validateData<LoginUserDTO>(ctx.body.user, [
          'password',
          'OR:email,username'
        ]);

      const response = await LoginUserUseCase.getInstance(
        UserRepository,
        AuthenticationService
      ).execute(
        {
          email: email ? new UserEmail(email) : undefined,
          username: username ? new UserUsername(username) : undefined
        },
        new UserPassword(password)
      );

      const { status, success, contain } = response.toPrimitives();

      return { status, response: { success, ...contain } };
    } catch (error: any) {
      return this.mapperException(error, ctx.body, 'Users v1');
    }
  }
}
