import { inject, injectable } from 'inversify';
import { TYPES } from '@/user/v1/infrastructure/d-injection/types';
import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { IRequestAdapter } from '@/shared/domain/interfaces/request.adapter';
import { LoginUserDTO } from '@/user/v1/gateway/dtos/login.user.dto';
import { UserEmail } from '@/user/v1/domain/user/value-objects/user.email';
import { UserUsername } from '@/user/v1/domain/user/value-objects/user.username';
import { UserPassword } from '@/user/v1/domain/user/value-objects/user.password';
import { LoginUserUseCase } from '@/user/v1/application/login-user/use.case';
import {
  Context,
  Controller
} from '@/shared/infrastructure/controller/decorators/controller';

@Controller({
  http: 'post',
  path: '/login/'
})
@injectable()
export class UserLoginController extends BaseController {
  constructor(
    @inject(TYPES.LoginUserUseCase)
    private readonly loginUseCase: LoginUserUseCase,
    @inject(TYPES.IRequestAdapter)
    private readonly requestAdapter: IRequestAdapter
  ) {
    super();
  }

  async execute(ctx: Context) {
    try {
      const { email, username, password }: LoginUserDTO =
        await this.requestAdapter.validateData<LoginUserDTO>(ctx.body.user, [
          'password',
          'OR:email,username'
        ]);

      const response = await this.loginUseCase.execute(
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
