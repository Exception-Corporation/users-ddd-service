import { inject, injectable } from '@container';
import { TYPES } from '@/user/v1/infrastructure/d-injection/types';
import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { IRequestAdapter } from '@/shared/domain/interfaces/request.adapter';
import { CreateUserDTO } from '@/user/v1/gateway/dtos/create.user.dto';
import { User } from '@/user/v1/domain/user/user.aggregate.root';
import { CreateUserUseCase } from '@/user/v1/application/create-user/use.case';
import {
  Controller,
  Context
} from '@/shared/infrastructure/controller/decorators/controller';
import { Role } from '@/shared/infrastructure/http-framework/shared/roles';
import { schema } from '@/shared/infrastructure/http-framework/shared/schema';

@Controller({
  http: 'post',
  path: ''
})
@schema({
  description: 'Service to create new user',
  tags: ['User'],
  summary: 'Create service (User)',
  body: {
    user: {
      firstname: 'Test',
      lastname: 'Test',
      username: 'Test',
      email: 'test@test.com',
      age: 0,
      password: 'test',
      phone: '0000000000',
      role: 'optional'
    }
  },
  response: {
    200: {
      success: true,
      user: {
        id: 1,
        firstname: 'Test',
        lastname: 'Test',
        username: 'Test',
        email: 'test@test.com',
        age: 0,
        phone: '0000000000',
        role: 'visitor',
        password:
          '$2b$04$mpGGoASjMT31tgs3fKSq5.pLNQqMDqFR9YBoEkSOcSttn7PnMMjkO',
        active: true,
        createdAt: 'Sun Dec 18 2022 05:50:14 GMT-0600 (hora estándar central)',
        updatedAt: 'Sun Dec 18 2022 05:50:14 GMT-0600 (hora estándar central)'
      }
    },
    400: {
      success: false,
      module: 'global',
      type: 'API_BAD_REQUEST',
      message:
        'Bad request: DTO is not correct, invalid properties: [An instance of CreateUserDTO has failed the validation: - property phone has failed the following constraints: isString]'
    },
    500: {
      success: false,
      module: 'global',
      type: 'API_UNSUPPORTED',
      message:
        'Unsupported: INTERNAL DATABASE ERROR: QueryFailedError: duplicate key value violates unique constraint "UQ_78a916df40e02a9deb1c4b75edb"'
    }
  }
})
@injectable()
export class UserCreateController extends BaseController {
  constructor(
    @inject(TYPES.CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
    @inject(TYPES.IRequestAdapter)
    private readonly requestAdapter: IRequestAdapter<CreateUserDTO>
  ) {
    super();
  }

  async execute(ctx: Context) {
    try {
      const userToCreate: CreateUserDTO =
        await this.requestAdapter.validateData(
          ctx.body.user,
          ['firstname', 'lastname', 'username', 'email', 'age', 'password'],
          CreateUserDTO
        );

      userToCreate.role = userToCreate.role || Role.STANDARD;

      const response = await this.createUserUseCase.execute(
        User.fromPrimitives({
          ...userToCreate,
          id: 0,
          createdAt: Date.now().toString(),
          updatedAt: Date.now().toString(),
          active: true,
          role: userToCreate.role
        })
      );

      const { status, success, contain } = response.toPrimitives();

      return { status, response: { success, ...contain } };
    } catch (error: any) {
      return this.mapperException(error, ctx.body, 'Users v1');
    }
  }
}
