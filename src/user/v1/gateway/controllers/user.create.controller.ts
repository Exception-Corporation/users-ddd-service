import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { RequestAdapter } from '@/user/v1/infrastructure/adapters/';
import { CreateUserDTO } from '@/user/v1/gateway/dtos/create.user.dto';
import { UserRepository } from '@/user/v1/infrastructure/repositories';
import { User } from '@/user/v1/domain/user/user.aggregate.root';
import { CreateUserUseCase } from '@/user/v1/application/create-user/use.case';
import {
  Controller,
  Context
} from '@/shared/infrastructure/controller/decorators/controller';

@Controller({
  http: 'post',
  path: ''
})
export class UserCreateController extends BaseController {
  constructor() {
    super();
  }

  async execute(ctx: Context) {
    try {
      const userToCreate: CreateUserDTO =
        await RequestAdapter.validateData<CreateUserDTO>(ctx.body.user, [
          'firstname',
          'lastname',
          'username',
          'email',
          'age',
          'password'
        ]);

      userToCreate.role = userToCreate.role || 'standard';

      const response = await CreateUserUseCase.getInstance(
        UserRepository
      ).execute(
        User.fromPrimitives({
          ...userToCreate,
          id: 0,
          createdAt: Date.now().toString(),
          updatedAt: Date.now().toString(),
          active: true
        })
      );

      const { status, success, contain } = response.toPrimitives();

      return { status, response: { success, ...contain } };
    } catch (error: any) {
      return this.mapperException(error, ctx.body, 'Users v1');
    }
  }
}
