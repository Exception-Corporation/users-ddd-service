import { inject, provide } from '@container';
import { TYPES } from '@/user/v1/infrastructure/d-injection/types';
import { TYPES as TYPES_SHARED } from '@/shared/infrastructure/d-injection/types';
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
import HttpStatus from '@/shared/domain/errors/lib/HttpStatus';

@provide(TYPES.GetPasswordUseCase)
export class GetPasswordUseCase extends UseCase {
  constructor(
    @inject(TYPES_SHARED.EventBus) private readonly eventBus: EventBus,
    @inject(TYPES_SHARED.IAuthentication)
    private readonly authenticationService: IAuthentication,
    @inject(TYPES.UserRepository) private readonly repository: UserRepository
  ) {
    super();
  }

  async execute(email: UserEmail, url: string): Promise<Response> {
    const emailTo = email.valueOf();

    const userFound = await this.repository.findById(0, emailTo);

    if (!userFound) throw new UserNotFound('email', emailTo);

    const access_token = await this.buildToken(
      userFound.getUserId().valueOf(),
      emailTo
    );

    await this.publish(emailTo, access_token, url);

    let response: ResponsePrimitive = {
      success: true,
      status: HttpStatus.OK,
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

  private async publish(email: string, token: string, url: string) {
    await this.eventBus.publish([
      new SendEmailDomainEvent(
        Identifier.random().valueOf(),
        {
          to: email,
          subject: 'Recover password in DE Bagstore',
          html: missingPassword(email, `${url}?token=${token}`)
        },
        new Date()
      )
    ]);
  }
}
