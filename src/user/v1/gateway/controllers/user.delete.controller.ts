import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { UserRepository } from '@/user/v1/infrastructure/repositories';
import { UserId } from '@/user/v1/domain/user/value-objects/user.id';
import { DeleteUserUseCase } from '@/user/v1/application/delete-user/use.case';
import {
  Context,
  Controller
} from '@/shared/infrastructure/controller/decorators/controller';
import { GuardWithJwt } from '@/shared/infrastructure/http-framework/middlewares/security/security.decorator';

@Controller({
  http: 'delete',
  path: '/delete/:id'
})
@GuardWithJwt(['standard', 'root'])
export class UserDeleteController extends BaseController {
  constructor() {
    super();
  }

  async execute(ctx: Context) {
    try {
      let response = await DeleteUserUseCase.getInstance(
        UserRepository
      ).execute(new UserId(Number(ctx.params.id)));

      const { status, success, contain } = response.toPrimitives();

      return { status, response: { success, ...contain } };
    } catch (error: any) {
      return this.mapperException(error, ctx.body, 'Users v1');
    }
  }
}
