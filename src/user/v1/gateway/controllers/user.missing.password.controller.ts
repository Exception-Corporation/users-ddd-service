import { inject, injectable } from 'inversify';
import { TYPES } from '@/user/v1/infrastructure/d-injection/types';
import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { UserEmail } from '@/user/v1/domain/user/value-objects/user.email';
import { GetPasswordUseCase } from '@/user/v1/application/get-password/use.case';
import {
  Context,
  Controller
} from '@/shared/infrastructure/controller/decorators/controller';

@Controller({
  http: 'post',
  path: '/missing/password/:email'
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
