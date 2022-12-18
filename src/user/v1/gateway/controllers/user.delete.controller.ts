import { inject, injectable } from 'inversify';
import { TYPES } from '@/user/v1/infrastructure/d-injection/types';
import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { UserId } from '@/user/v1/domain/user/value-objects/user.id';
import { DeleteUserUseCase } from '@/user/v1/application/delete-user/use.case';
import {
  Context,
  Controller
} from '@/shared/infrastructure/controller/decorators/controller';
import { GuardWithJwt } from '@/shared/infrastructure/http-framework/middlewares/security/security.decorator';
import { BASIC } from '@/shared/infrastructure/http-framework/shared/roles';

@Controller({
  http: 'delete',
  path: '/delete/:id'
})
@GuardWithJwt(BASIC)
@injectable()
export class UserDeleteController extends BaseController {
  constructor(
    @inject(TYPES.DeleteUserUseCase)
    private readonly deleteUserUseCase: DeleteUserUseCase
  ) {
    super();
  }

  async execute(ctx: Context) {
    try {
      let response = await this.deleteUserUseCase.execute(
        new UserId(Number(ctx.params.id))
      );

      const { status, success, contain } = response.toPrimitives();

      return { status, response: { success, ...contain } };
    } catch (error: any) {
      return this.mapperException(error, ctx.body, 'Users v1');
    }
  }
}
