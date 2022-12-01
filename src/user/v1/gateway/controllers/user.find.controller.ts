import { inject, injectable } from 'inversify';
import { TYPES } from '@/user/v1/infrastructure/d-injection/types';
import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { UserId } from '@/user/v1/domain/user/value-objects/user.id';
import { FindUserUseCase } from '@/user/v1/application/find-user-by/use.case';
import {
  Context,
  Controller
} from '@/shared/infrastructure/controller/decorators/controller';
import { GuardWithJwt } from '@/shared/infrastructure/http-framework/middlewares/security/security.decorator';
import { ALL_ROLES } from '@/shared/infrastructure/http-framework/middlewares/security/roles';

@Controller({
  http: 'get',
  path: '/get/:id'
})
@GuardWithJwt(ALL_ROLES)
@injectable()
export class UserFindController extends BaseController {
  constructor(
    @inject(TYPES.FindUserUseCase)
    private readonly findUseCase: FindUserUseCase
  ) {
    super();
  }

  async execute(ctx: Context) {
    const id = ctx.params.id;

    try {
      const response = await this.findUseCase.execute(new UserId(Number(id)));

      const { status, success, contain } = response.toPrimitives();

      return { status, response: { success, ...contain } };
    } catch (error: any) {
      return this.mapperException(error, ctx.body, 'Users v1');
    }
  }
}
