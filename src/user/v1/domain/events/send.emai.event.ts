import { DomainEvent } from '@/shared/domain/event-bus/domain.event';
import { Body } from '@/user/v1/domain/events/user.email.event';

type SendEmailDomainEventBody = {
  readonly eventName: string;
  readonly id: string;
  readonly data: Body;
};

export class SendEmailDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'User_email_initialize';
  static readonly EVENT_TYPE = 'PRODUCER';

  private id: string;
  private data: Body;

  constructor(id: string, data: Body, occurredAt: Date) {
    super(
      SendEmailDomainEvent.EVENT_NAME,
      SendEmailDomainEvent.EVENT_TYPE,
      id,
      occurredAt
    );
    this.id = id;
    this.data = data;
  }

  getId(): string {
    return this.id;
  }

  getData(): Body {
    return this.data;
  }

  toPrimitive(): SendEmailDomainEventBody {
    const { id, data } = this;
    return {
      id,
      data,
      eventName: SendEmailDomainEvent.EVENT_NAME
    };
  }

  static fromPrimitives(
    id: string,
    body: SendEmailDomainEventBody,
    occurredAt: Date
  ): DomainEvent {
    return new SendEmailDomainEvent(id, body.data, occurredAt);
  }
}
