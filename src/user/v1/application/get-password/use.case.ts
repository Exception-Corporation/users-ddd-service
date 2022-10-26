import { UseCase } from '@/shared/infrastructure/use-cases/UseCase';
import {
  Response,
  ResponsePrimitive
} from '@/user/v1/domain/response/response.entity';
import { IMailer } from '@/shared/domain/mail/mailer.interface';
import { UserEmail } from '@/user/v1/domain/user/value-objects/user.email';
import missingPassword from '@/shared/domain/mail/templates/missing.password';
import { IAuthentication } from '@/shared/domain/auth/authentication.interface';
import config from '@/shared/infrastructure/config';
import { UserRepository } from '@/user/v1/domain/repositories/user.repository';
import { UserNotFound } from '@/shared/domain/errors/domain-errors/UserNotFound';

export class GetPasswordUseCase extends UseCase {
  private static instance: GetPasswordUseCase | undefined;
  constructor(
    private mailerService: IMailer<any>,
    private authenticationService: IAuthentication,
    private repository: UserRepository
  ) {
    super();
  }

  static getInstance(
    mailerService: IMailer<any>,
    authenticationService: IAuthentication,
    repository: UserRepository
  ) {
    if (!this.instance) {
      this.instance = new GetPasswordUseCase(
        mailerService,
        authenticationService,
        repository
      );
    }

    return this.instance;
  }

  async execute(email: UserEmail): Promise<Response> {
    const emailTo = email.valueOf();

    const userFound = await this.repository.findById(0, emailTo);

    if (!userFound) throw new UserNotFound('email', emailTo);

    const access_token = await this.authenticationService.sign({
      id: userFound.getUserId().valueOf(),
      role: 'standard',
      action: 'get-password',
      email: emailTo,
      exp: 1
    });

    await this.mailerService.send({
      to: email,
      subject: 'Recover password in CRM',
      html: missingPassword(
        emailTo,
        `${config.mailer.nodemailer.front}?token=${access_token}`
      )
    });

    let response: ResponsePrimitive = {
      success: true,
      status: 200,
      contain: {
        access_token
      }
    };

    return Response.fromPrimitives(
      response.success,
      response.status,
      response.contain
    );
  }
}
