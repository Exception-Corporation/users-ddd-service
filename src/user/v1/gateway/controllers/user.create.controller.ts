import { inject, injectable } from 'inversify';
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

@Controller({
  http: 'post',
  path: ''
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

      userToCreate.role = userToCreate.role || 'standard';

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
