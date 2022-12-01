import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { UserRepository } from '@/user/v1/infrastructure/repositories';
import { FindAllUsersUseCase } from '@/user/v1/application/find-all-user-by/use.case';
import {
  Context,
  Controller
} from '@/shared/infrastructure/controller/decorators/controller';
import { GuardWithJwt } from '@/shared/infrastructure/http-framework/middlewares/security/security.decorator';
import { BASIC } from '@/shared/infrastructure/http-framework/middlewares/security/roles';

@Controller({
  http: 'get',
  path: '/getAll'
})
@GuardWithJwt(BASIC)
export class UserFindAllController extends BaseController {
  constructor() {
    super();
  }

  async execute(ctx: Context) {
    let { pageSize, page, searchBy } = ctx.query;

    searchBy = searchBy || '';

    try {
      const response = await FindAllUsersUseCase.getInstance(
        UserRepository
      ).execute({
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
