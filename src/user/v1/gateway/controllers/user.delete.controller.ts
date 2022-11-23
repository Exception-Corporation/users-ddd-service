import { Request, Response } from 'express';
import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { UserRepository } from '@/user/v1/infrastructure/repositories';
import { UserId } from '@/user/v1/domain/user/value-objects/user.id';
import { DeleteUserUseCase } from '@/user/v1/application/delete-user/use.case';
import { Controller } from '@/shared/infrastructure/controller/decorators/controller';

@Controller({
  http: 'delete',
  path: '/delete/:id',
  roles: ['standard', 'root']
})
export class UserDeleteController extends BaseController<Request, Response> {
  constructor() {
    super();
  }

  async execute(req: Request, res: Response) {
    try {
      let response = await DeleteUserUseCase.getInstance(
        UserRepository
      ).execute(new UserId(Number(req.params.id)));

      const { status, success, contain } = response.toPrimitives();

      return res.status(status).send({ success, ...contain });
    } catch (error: any) {
      return this.mapperException(res, error, req.body, 'Users v1');
    }
  }
}
