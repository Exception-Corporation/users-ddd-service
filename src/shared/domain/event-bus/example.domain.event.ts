import { DomainEvent } from '@/shared/domain/event-bus/domain.event';

type CreateExampleDomainEventBody = {
  readonly eventName: string;
  readonly id: string;
  readonly name: string;
  readonly breed: string;
};
export class ExampleCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'example.created';
  static readonly EVENT_TYPE = null;

  private id: string;
  private name: string;
  private breed: string;

  constructor(id: string, name: string, breed: string, occurredAt: Date) {
    super(
      ExampleCreatedDomainEvent.EVENT_NAME,
      ExampleCreatedDomainEvent.EVENT_TYPE,
      id,
      occurredAt
    );
    this.id = id;
    this.name = name;
    this.breed = breed;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getBreed(): string {
    return this.breed;
  }

  toPrimitive(): CreateExampleDomainEventBody {
    const { id, name, breed } = this;
    return {
      id,
      name,
      breed,
      eventName: ExampleCreatedDomainEvent.EVENT_NAME
    };
  }

  static fromPrimitives(
    id: string,
    body: CreateExampleDomainEventBody,
    occurredAt: Date
  ): DomainEvent {
    return new ExampleCreatedDomainEvent(id, body.name, body.breed, occurredAt);
  }
}
