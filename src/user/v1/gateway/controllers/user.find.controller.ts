import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { UserRepository } from '@/user/v1/infrastructure/repositories';
import { UserId } from '@/user/v1/domain/user/value-objects/user.id';
import { FindUserUseCase } from '@/user/v1/application/find-user-by/use.case';
import {
  Context,
  Controller
} from '@/shared/infrastructure/controller/decorators/controller';
import { GuardWithJwt } from '@/shared/infrastructure/http-framework/middlewares/security/security.decorator';

@Controller({
  http: 'get',
  path: '/get/:id'
})
@GuardWithJwt(['standard', 'root', 'visitor'])
export class UserFindController extends BaseController {
  constructor() {
    super();
  }

  async execute(ctx: Context) {
    const id = ctx.params.id;

    try {
      const response = await FindUserUseCase.getInstance(
        UserRepository
      ).execute(new UserId(Number(id)));

      const { status, success, contain } = response.toPrimitives();

      return { status, response: { success, ...contain } };
    } catch (error: any) {
      return this.mapperException(error, ctx.body, 'Users v1');
    }
  }
}
