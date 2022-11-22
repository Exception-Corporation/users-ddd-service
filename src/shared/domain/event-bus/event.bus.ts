import { DomainEvent } from '@/shared/domain/event-bus/domain.event';
import { DomainEventSubscriber } from '@/shared/domain/event-bus/domain.event.subscriber';

export interface EventBus {
  addSubscribers(subscribers: Array<DomainEventSubscriber<DomainEvent>>): void;
  start(): Promise<void>;
  publish(events: Array<DomainEvent>): Promise<void>;
}
