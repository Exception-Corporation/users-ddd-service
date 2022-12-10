import { inject, injectable } from 'inversify';
import { TYPES } from '@/user/v1/infrastructure/d-injection/types';
import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { FindAllUsersUseCase } from '@/user/v1/application/find-all-user-by/use.case';
import {
  Context,
  Controller
} from '@/shared/infrastructure/controller/decorators/controller';
import { GuardWithJwt } from '@/shared/infrastructure/http-framework/middlewares/security/security.decorator';
import { BASIC } from '@/shared/infrastructure/http-framework/middlewares/shared/roles';

@Controller({
  http: 'get',
  path: '/getAll'
})
@GuardWithJwt(BASIC)
@injectable()
export class UserFindAllController extends BaseController {
  constructor(
    @inject(TYPES.FindAllUsersUseCase)
    private readonly findUseCase: FindAllUsersUseCase
  ) {
    super();
  }

  async execute(ctx: Context) {
    let { pageSize, page, searchBy } = ctx.query;

    searchBy = searchBy || '';

    try {
      const response = await this.findUseCase.execute({
        searchBy: {
          firstname: searchBy,
          lastname: searchBy,
          email: searchBy,
          username: searchBy,
          age: Number(searchBy)
        },
        pageSize: pageSize ? Number(pageSize) : 10,
        page: page ? Number(page) : 1
      });

      const { status, success, contain } = response.toPrimitives();

      return { status, response: { success, ...contain } };
    } catch (error: any) {
      return this.mapperException(error, ctx.body, 'Users v1');
    }
  }
}
