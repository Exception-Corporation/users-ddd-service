import * as uuid from 'uuid';

export abstract class DomainEvent {
  static EVENT_NAME: string;
  static EVENT_TYPE: string | null;

  readonly eventName: string;
  readonly eventType: string | null;
  readonly eventId: string;
  readonly occurredAt: Date;

  constructor(
    eventName: string,
    eventType: string | null,
    eventId?: string,
    occurredAt?: Date
  ) {
    this.eventName = eventName;
    this.eventType = eventType || null;
    this.eventId = eventId || uuid.v4();
    this.occurredAt = occurredAt || new Date();
  }

  abstract toPrimitive(): Object;

  static fromPrimitives: (...args: any[]) => any;
}

export type DomainEventClass = {
  EVENT_NAME: string;
  EVENT_TYPE: string | null;
  fromPrimitives(...args: any[]): DomainEvent;
};
