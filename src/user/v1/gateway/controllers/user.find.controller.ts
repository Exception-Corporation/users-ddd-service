import { Request, Response } from 'express';
import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { UserRepository } from '@/user/v1/infrastructure/repositories';
import { UserId } from '@/user/v1/domain/user/value-objects/user.id';
import { FindUserUseCase } from '@/user/v1/application/find-user-by/use.case';
import { Controller } from '@/shared/infrastructure/controller/decorators/controller';
import { GuardWithJwt } from '@/shared/infrastructure/http-framework/middlewares/security/security.decorator';

@Controller({
  http: 'get',
  path: '/get/:id'
})
@GuardWithJwt(['standard', 'root', 'visitor'])
export class UserFindController extends BaseController<Request, Response> {
  constructor() {
    super();
  }

  async execute(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const response = await FindUserUseCase.getInstance(
        UserRepository
      ).execute(new UserId(Number(id)));

      const { status, success, contain } = response.toPrimitives();

      return res.status(status).send({ success, ...contain });
    } catch (error: any) {
      return this.mapperException(res, error, req.body, 'Users v1');
    }
  }
}
