import { inject, injectable } from 'inversify';
import { TYPES } from '@/user/v1/infrastructure/d-injection/types';
import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { UserEmail } from '@/user/v1/domain/user/value-objects/user.email';
import { GetPasswordUseCase } from '@/user/v1/application/get-password/use.case';
import {
  Context,
  Controller
} from '@/shared/infrastructure/controller/decorators/controller';
import { schema } from '@/shared/infrastructure/http-framework/shared/schema';

@Controller({
  http: 'post',
  path: '/missing/password/:email'
})
@schema({
  description: 'Service to delete user',
  tags: ['User'],
  summary: 'Delete service (User)',
  params: {
    email: 'test@test.com'
  },
  response: {
    200: {
      success: true,
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RuYW1lIjoiYWRtaW4iLCJsYXN0bmFtZSI6IjEuMCIsInVzZXJuYW1lIjoiYWRtaW4iLCJwaG9uZSI6IjAiLCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJyb290IiwiYWdlIjozMCwiZXhwIjoxNjcyMTY0MjEwLCJpYXQiOjE2NzIxMTAyMTB9.jR83bU5Zp32TU-OUJrKg34NeQ2MNmOcm2r0e8F7ppDs'
    },
    404: {
      success: false,
      message: 'Not found: User with email: test@gmail.com was not found'
    }
  }
})
@injectable()
export class UserMissingPasswordController extends BaseController {
  constructor(
    @inject(TYPES.GetPasswordUseCase)
    private readonly getPasswordUseCase: GetPasswordUseCase
  ) {
    super();
  }

  async execute(ctx: Context) {
    try {
      const { email } = ctx.params;

      const response = await this.getPasswordUseCase.execute(
        new UserEmail(email)
      );

      const { status, success, contain } = response.toPrimitives();

      return { status, response: { success, ...contain } };
    } catch (error: any) {
      return this.mapperException(error, ctx.body, 'Users v1');
    }
  }
}
