import { Request, Response } from 'express';
import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { UserEmail } from '@/user/v1/domain/user/value-objects/user.email';
import { AuthenticationService } from '@/shared/infrastructure/auth';
import { GetPasswordUseCase } from '@/user/v1/application/get-password/use.case';
import { MailerService } from '@/shared/infrastructure/mailer';
import { UserRepository } from '@/user/v1/infrastructure/repositories';
import { Controller } from '@/shared/infrastructure/controller/decorators/controller';

@Controller({
  http: 'post',
  path: '/missing/password/:email'
})
export class UserMissingPasswordController extends BaseController<
  Request,
  Response
> {
  constructor() {
    super();
  }

  async execute(req: Request, res: Response) {
    try {
      const { email } = req.params;

      const response = await GetPasswordUseCase.getInstance(
        MailerService,
        AuthenticationService,
        UserRepository
      ).execute(new UserEmail(email));

      const { status, success, contain } = response.toPrimitives();

      return res.status(status).send({ success, ...contain });
    } catch (error: any) {
      return this.mapperException(res, error, req.body, 'Users v1');
    }
  }
}
