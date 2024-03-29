import { DomainEventMapping } from '@/shared/infrastructure/event-bus/rabbitmq/domain.event.mapping';

export class DomainEventJSONDeserializer {
  private mapping: DomainEventMapping;

  constructor(mapping: DomainEventMapping) {
    this.mapping = mapping;
  }

  deserialize(event: string) {
    const eventData = JSON.parse(event).data;
    const eventName = eventData.type;
    const eventClass = this.mapping.for(eventName);

    if (!eventClass) {
      return;
    }

    return eventClass.fromPrimitives(
      eventData.attributes.id,
      eventData.attributes,
      eventData.id,
      eventData.occurred_on
    );
  }
}
