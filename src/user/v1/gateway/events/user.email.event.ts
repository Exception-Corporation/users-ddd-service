import { inject, injectable } from 'inversify';
import { TYPES } from '@/user/v1/infrastructure/d-injection/types';
import { TYPES as TYPES_SHARED } from '@/shared/infrastructure/d-injection/types';

import { DomainEventClass } from '@/shared/domain/event-bus/domain.event';
import { DomainEventSubscriber } from '@/shared/domain/event-bus/domain.event.subscriber';

import { UserEmailDomainEvent } from '@/user/v1/domain/events/user.email.event';

import { IRequestAdapter } from '@/shared/domain/interfaces/request.adapter';

import { MailDto } from '@/user/v1/gateway/dtos/events/mail.dto';
import { EventIdDto } from '@/user/v1/gateway/dtos/events/eventId.dto';
import { Logger } from '@/shared/domain/logger';
import { IMailer } from '@/shared/domain/mail/mailer.interface';

@injectable()
export class UserEmailEvent
  implements DomainEventSubscriber<UserEmailDomainEvent>
{
  constructor(
    @inject(TYPES_SHARED.Logger) private readonly logger: Logger,
    @inject(TYPES_SHARED.IMailer)
    private readonly mailerService: IMailer<unknown>,
    @inject(TYPES.IRequestAdapter)
    private readonly requestAdapter: IRequestAdapter
  ) {}

  subscribedTo(): DomainEventClass[] {
    return [UserEmailDomainEvent];
  }

  async on(domainEvent: UserEmailDomainEvent): Promise<void> {
    this.logger.info(`listening User v1: event ${domainEvent.eventName}`);

    // Get Params
    const body = {
      data: domainEvent.getData()
    };

    const data = await this.requestAdapter.validateData(body.data, [
      'html',
      'to',
      'subject'
    ]);

    const { to, subject, html } = MailDto.fromJson(data).to().toPrimitives();

    const eventId = EventIdDto.fromString(domainEvent.eventId);

    await this.mailerService.send({
      to,
      subject,
      html
    });

    this.logger.success({
      entityinfo: { class: UserEmailEvent.name },
      level: 'ok',
      module: UserEmailEvent.name,
      result: `The mail was sent with the eventId: ${eventId.to().valueOf()}`
    });
  }
}
