import { DomainEventClass } from '@/shared/domain/event-bus/domain.event';
import { DomainEventSubscriber } from '@/shared/domain/event-bus/domain.event.subscriber';

import { UserEmailDomainEvent } from '@/user/v1/domain/events/user.email.event';

import { EventBus } from '@/shared/domain/event-bus/event.bus';
import { RequestAdapter } from '@/user/v1/infrastructure/adapters';

import { MailDto } from '@/user/v1/gateway/dtos/events/mail.dto';
import { EventIdDto } from '@/user/v1/gateway/dtos/events/eventId.dto';
import { Logger } from '@/shared/domain/logger';
import { MailerService } from '@/shared/infrastructure/mailer';

export class UserEmailEvent
  implements DomainEventSubscriber<UserEmailDomainEvent>
{
  constructor(
    private readonly eventBus: EventBus,
    private readonly logger: Logger
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

    const data = await RequestAdapter.validateData(body.data, [
      'html',
      'to',
      'subject'
    ]);

    const { to, subject, html } = MailDto.fromJson(data).to().toPrimitives();

    const eventId = EventIdDto.fromString(domainEvent.eventId);

    await MailerService.send({
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
