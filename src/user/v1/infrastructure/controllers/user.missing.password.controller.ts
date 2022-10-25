import { Request, Response } from 'express';
import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { UserEmail } from '@/user/v1/domain/user/value-objects/user.email';
import { AuthenticationService } from '@/shared/infrastructure/auth';
import { GetPasswordUseCase } from '@/user/v1/application/get-password/use.case';
import { MailerService } from '@/shared/infrastructure/mailer';

export class UserMissingPasswordController extends BaseController {
  public http = 'post';
  public roles?: Array<string>;
  public path: string;

  constructor() {
    super();
    this.path = '/missing/password/:email';
  }

  async execute(req: Request, res: Response) {
    try {
      const { email } = req.params;

      const response = await GetPasswordUseCase.getInstance(
        MailerService,
        AuthenticationService
      ).execute(new UserEmail(email));

      const { status, success, contain } = response.toPrimitives();

      return res.status(status).send({ success, ...contain });
    } catch (error: any) {
      return this.mapperException(res, error, req.body, 'Users v1');
    }
  }
}
