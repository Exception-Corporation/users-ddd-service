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
import { ALL_ROLES } from '@/shared/infrastructure/http-framework/shared/roles';
import { schema } from '@/shared/infrastructure/http-framework/shared/schema';

@Controller({
  http: 'get',
  path: '/get/:id'
})
@GuardWithJwt(ALL_ROLES)
@schema({
  description: 'Service to get a user',
  tags: ['User'],
  summary: 'Get service (User)',
  headers: {
    Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
  },
  params: {
    id: 123
  },
  response: {
    200: {
      success: true,
      user: {
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
        createdAt: 'Thu Dec 22 2022 18:45:03 GMT-0600 (Central Standard Time)',
        updatedAt: 'Thu Dec 22 2022 18:45:03 GMT-0600 (Central Standard Time)'
      }
    },
    404: {
      success: false,
      message: 'Not found: User with id: 12 was not found'
    },
    500: {
      success: false,
      module: 'global',
      type: 'API_UNSUPPORTED',
      message:
        'Unsupported: INTERNAL DATABASE ERROR: QueryFailedError: invalid input syntax for type integer: "NaN"'
    }
  }
})
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
