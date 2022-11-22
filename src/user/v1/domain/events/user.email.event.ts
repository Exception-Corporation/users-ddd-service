import { DomainEvent } from '@/shared/domain/event-bus/domain.event';

type Body = {
  to: string;
  subject: string;
  html: string;
};

type UserEmailDomainEventBody = {
  readonly eventName: string;
  readonly id: string;
  readonly data: Body;
};

export class UserEmailDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'User_email_initialize';
  static readonly EVENT_TYPE = 'CONSUMER';

  private id: string;
  private data: Body;

  constructor(id: string, data: Body, occurredAt: Date) {
    super(
      UserEmailDomainEvent.EVENT_NAME,
      UserEmailDomainEvent.EVENT_TYPE,
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

  toPrimitive(): UserEmailDomainEventBody {
    const { id, data } = this;
    return {
      id,
      data,
      eventName: UserEmailDomainEvent.EVENT_NAME
    };
  }

  static fromPrimitives(
    id: string,
    body: UserEmailDomainEventBody,
    occurredAt: Date
  ): DomainEvent {
    return new UserEmailDomainEvent(id, body.data, occurredAt);
  }
}
