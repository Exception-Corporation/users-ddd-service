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

export class GetPasswordUseCase extends UseCase {
  private static instance: GetPasswordUseCase | undefined;
  constructor(
    private mailerService: IMailer<any>,
    private authenticationService: IAuthentication
  ) {
    super();
  }

  static getInstance(
    mailerService: IMailer<any>,
    authenticationService: IAuthentication
  ) {
    if (!this.instance) {
      this.instance = new GetPasswordUseCase(
        mailerService,
        authenticationService
      );
    }

    return this.instance;
  }

  async execute(email: UserEmail): Promise<Response> {
    const access_token = await this.authenticationService.sign({
      role: 'standard',
      action: 'get-password',
      email: email.valueOf(),
      exp: 1
    });

    await this.mailerService.send({
      to: email.valueOf(),
      subject: 'Recover password in CRM',
      html: missingPassword(
        email.valueOf(),
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
