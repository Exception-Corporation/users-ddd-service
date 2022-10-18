import { Request, Response } from 'express';
import { BaseController } from '@/shared/infrastructure/controller/base.controller';
import { RequestAdapter } from '@/user/v1/infrastructure/adapters/';
import { LoginUserDTO } from '@/user/v1/infrastructure/dtos/login.user.dto';
import { UserRepository } from '@/user/v1/infrastructure/repositories';
import { UserEmail } from '@/user/v1/domain/user/value-objects/user.email';
import { UserUsername } from '@/user/v1/domain/user/value-objects/user.username';
import { UserPassword } from '@/user/v1/domain/user/value-objects/user.password';
import { LoginUserUseCase } from '@/user/v1/application/login-user/use.case';

export class UserLoginController extends BaseController {
  public http = 'post';
  public roles?: Array<string>;
  public path: string;

  constructor() {
    super();
    this.path = '/login/';
  }

  async execute(req: Request, res: Response) {
    try {
      const { email, username, password }: LoginUserDTO =
        await RequestAdapter.build<LoginUserDTO>(req.body.user, [
          'password',
          'OR:email,username'
        ]);

      const response = await LoginUserUseCase.getInstance(
        UserRepository
      ).execute(
        {
          email: email ? new UserEmail(email) : undefined,
          username: username ? new UserUsername(username) : undefined
        },
        new UserPassword(password)
      );

      const { status, success, contain } = response.toPrimitives();

      return res.status(status).send({ success, ...contain });
    } catch (error: any) {
      return this.mapperException(res, error, req.body, 'Users v1');
    }
  }
}
