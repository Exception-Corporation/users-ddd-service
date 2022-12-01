import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { UserEmail } from '@/user/v1/domain/user/value-objects/user.email';
import { AuthenticationService } from '@/shared/infrastructure/auth';
import { GetPasswordUseCase } from '@/user/v1/application/get-password/use.case';
import { UserRepository } from '@/user/v1/infrastructure/repositories';
import {
  Context,
  Controller
} from '@/shared/infrastructure/controller/decorators/controller';

@Controller({
  http: 'post',
  path: '/missing/password/:email'
})
export class UserMissingPasswordController extends BaseController {
  constructor() {
    super();
  }

  async execute(ctx: Context) {
    try {
      const { email } = ctx.params;

      const response = await GetPasswordUseCase.getInstance(
        {} as any,
        AuthenticationService,
        UserRepository
      ).execute(new UserEmail(email));

      const { status, success, contain } = response.toPrimitives();

      return { status, response: { success, ...contain } };
    } catch (error: any) {
      return this.mapperException(error, ctx.body, 'Users v1');
    }
  }
}
