import { inject, injectable } from '@container';
import { TYPES } from '@/user/v1/infrastructure/d-injection/types';
import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { IRequestAdapter } from '@/shared/domain/interfaces/request.adapter';
import { LoginUserDTO } from '@/user/v1/gateway/dtos/login.user.dto';
import { LoginUserUseCase } from '@/user/v1/application/login-user/use.case';
import {
  Context,
  Controller
} from '@/shared/infrastructure/controller/decorators/controller';
import { schema } from '@/shared/infrastructure/http-framework/shared/schema';

@Controller({
  http: 'post',
  path: '/login'
})
@schema({
  description: 'Service login user',
  tags: ['User'],
  summary: 'Login service (User)',
  body: {
    user: {
      username: 'admin',
      email: 'admin@admin.com',
      password: 'admin'
    }
  },
  response: {
    200: {
      success: true,
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RuYW1lIjoiYWRtaW4iLCJsYXN0bmFtZSI6IjEuMCIsInVzZXJuYW1lIjoiYWRtaW4iLCJwaG9uZSI6IjAiLCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJyb290IiwiYWdlIjozMCwiZXhwIjoxNjcyMTY0MjEwLCJpYXQiOjE2NzIxMTAyMTB9.jR83bU5Zp32TU-OUJrKg34NeQ2MNmOcm2r0e8F7ppDs'
    },
    404: {
      success: false,
      module: 'global',
      type: 'API_NOT_FOUND',
      message: 'Not found: User with username: test was not found'
    },
    400: {
      success: false,
      module: 'global',
      type: 'API_BAD_REQUEST',
      message:
        'Bad request: DTO is not correct, invalid properties: [email,username]'
    }
  }
})
@injectable()
export class UserLoginController extends BaseController {
  constructor(
    @inject(TYPES.LoginUserUseCase)
    private readonly loginUseCase: LoginUserUseCase,
    @inject(TYPES.IRequestAdapter)
    private readonly requestAdapter: IRequestAdapter<LoginUserDTO>
  ) {
    super();
  }

  async execute(ctx: Context) {
    try {
      const login: LoginUserDTO = await this.requestAdapter.validateData(
        ctx.body.user,
        ['password', 'OR:email,username'],
        LoginUserDTO
      );

      const response = await this.loginUseCase.execute(
        LoginUserDTO.toDomain(login)
      );

      const { status, success, contain } = response.toPrimitives();

      return { status, response: { success, ...contain } };
    } catch (error: any) {
      return this.mapperException(error, ctx.body, 'Users v1');
    }
  }
}
