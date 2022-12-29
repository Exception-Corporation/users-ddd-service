import { inject, injectable } from 'inversify';
import { TYPES } from '@/user/v1/infrastructure/d-injection/types';
import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { FindAllUsersUseCase } from '@/user/v1/application/find-all-user-by/use.case';
import {
  Context,
  Controller
} from '@/shared/infrastructure/controller/decorators/controller';
import { GuardWithJwt } from '@/shared/infrastructure/http-framework/shared/middlewares/security/security.decorator';
import { BASIC } from '@/shared/infrastructure/http-framework/shared/roles';
import { schema } from '@/shared/infrastructure/http-framework/shared/schema';

@Controller({
  http: 'get',
  path: '/getAll'
})
@GuardWithJwt(BASIC)
@schema({
  description: 'Service to get all users',
  tags: ['User'],
  summary: 'Get all service (User)',
  headers: {
    Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
  },
  querystring: {
    pageSize: 3,
    page: 1,
    searchBy: 'q'
  },
  response: {
    200: {
      success: true,
      page: 1,
      itemsByPage: 8,
      usersSize: 6,
      totalUsers: 6,
      totalPages: 1,
      users: [
        {
          id: 1,
          firstname: 'Test',
          lastname: 'test',
          username: 'test',
          phone: '0000000',
          email: 'test@gmail.com',
          password:
            '$2b$04$2XhAHRK6VnPqC7eYm2k78uoJKfsHVn.drNY6cwVH4MDVsSdBiNt7m',
          role: 'standard',
          age: 21,
          active: true,
          createdAt:
            'Thu Dec 22 2022 18:45:03 GMT-0600 (Central Standard Time)',
          updatedAt: 'Thu Dec 22 2022 18:45:03 GMT-0600 (Central Standard Time)'
        }
      ]
    }
  }
})
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
