import { UseCase } from '@/shared/infrastructure/use-cases/UseCase';
import {
  Response,
  ResponsePrimitive
} from '@/user/v1/domain/response/response.entity';
import { Identifier } from '@/shared/infrastructure/uuid/identifier';
import { UserEmail } from '@/user/v1/domain/user/value-objects/user.email';
import missingPassword from '@/shared/domain/mail/templates/missing.password';
import { IAuthentication } from '@/shared/domain/auth/authentication.interface';
import { UserRepository } from '@/user/v1/domain/repositories/user.repository';
import { UserNotFound } from '@/shared/domain/errors/domain-errors/UserNotFound';
import { EventBus } from '@/shared/domain/event-bus/event.bus';
import { SendEmailDomainEvent } from '@/user/v1/domain/events/send.emai.event';
import config from '@/shared/infrastructure/config';

export class GetPasswordUseCase extends UseCase {
  private static instance: GetPasswordUseCase | undefined;
  constructor(
    private eventBus: EventBus,
    private authenticationService: IAuthentication,
    private repository: UserRepository
  ) {
    super();
  }

  static getInstance(
    eventBus: EventBus,
    authenticationService: IAuthentication,
    repository: UserRepository
  ) {
    if (!this.instance) {
      this.instance = new GetPasswordUseCase(
        eventBus,
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

    const access_token = await this.buildToken(
      userFound.getUserId().valueOf(),
      emailTo
    );

    await this.publish(emailTo, access_token);

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

  private async buildToken(id: number, email: string) {
    return await this.authenticationService.sign({
      id,
      role: 'standard',
      action: 'get-password',
      email,
      exp: 1
    });
  }

  private async publish(email: string, token: string) {
    await this.eventBus.publish([
      new SendEmailDomainEvent(
        Identifier.random().valueOf(),
        {
          to: email,
          subject: 'Recover password in CRM',
          html: missingPassword(
            email,
            `${config.mailer.nodemailer.front}?token=${token}`
          )
        },
        new Date()
      )
    ]);
  }
}
