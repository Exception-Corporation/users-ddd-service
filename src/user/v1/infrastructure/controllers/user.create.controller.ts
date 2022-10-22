import { Request, Response } from 'express';
import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { RequestAdapter } from '@/user/v1/infrastructure/adapters/';
import { CreateUserDTO } from '@/user/v1/infrastructure/dtos/create.user.dto';
import { UserRepository } from '@/user/v1/infrastructure/repositories';
import { User } from '@/user/v1/domain/user/user.aggregate.root';
import { CreateUserUseCase } from '@/user/v1/application/create-user/use.case';

export class UserCreateController extends BaseController {
  public http = 'post';
  public roles?: Array<string>;
  public path: string;

  constructor() {
    super();
    this.path = '';
  }

  async execute(req: Request, res: Response) {
    try {
      const userToCreate: CreateUserDTO =
        await RequestAdapter.build<CreateUserDTO>(req.body.user, [
          'firstname',
          'lastname',
          'username',
          'email',
          'age',
          'role',
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

      return res.status(status).send({ success, ...contain });
    } catch (error: any) {
      return this.mapperException(res, error, req.body, 'Users v1');
    }
  }
}
