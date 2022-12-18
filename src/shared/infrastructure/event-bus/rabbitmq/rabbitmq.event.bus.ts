import { Connection, Message, Exchange, Queue } from 'amqp-ts';
import { DomainEvent } from '@/shared/domain/event-bus/domain.event';
import { DomainEventSubscriber } from '@/shared/domain/event-bus/domain.event.subscriber';
import { EventBus } from '@/shared/domain/event-bus/event.bus';
import { DomainEventJSONDeserializer } from '@/shared/infrastructure/event-bus/rabbitmq/domain.event.json.deserializer';
import { DomainEventMapping } from '@/shared/infrastructure/event-bus/rabbitmq/domain.event.mapping';
import { Logger } from '@/shared/domain/logger';
import { InternalError } from '@/shared/domain/errors/domain-errors/InternalError';

type RabbitMQConfig = {
  user: string;
  password: string;
  host: string;
  port: number;
  queue: string;
  exchange: string;
  retries: number;
  interval: number;
};

export class RabbitMQEventBus implements EventBus {
  private connection: Connection;
  private exchange: Exchange;
  private queue: Queue;
  private subscribers: Map<string, Array<DomainEventSubscriber<DomainEvent>>>;
  private deserializer?: DomainEventJSONDeserializer;

  constructor(private readonly logger: Logger, config: RabbitMQConfig) {
    this.connection = new Connection(
      `amqp://${config.user}:${config.password}@${config.host}:${config.port}`,
      null,
      {
        retries: config.retries,
        interval: config.interval
      }
    );

    this.exchange = this.connection.declareExchange(config.exchange, 'fanout', {
      durable: false
    });

    this.queue = this.connection.declareQueue(config.queue);

    this.connection.on('open_connection', this.openConnection);

    this.connection.on('lost_connection', this.lostConnection);

    this.connection.on('error_connection', this.errorConnection);

    this.subscribers = new Map();
  }

  async start(): Promise<void> {
    if (!this.deserializer) {
      throw new InternalError(
        `[${RabbitMQEventBus.name}] has not been properly initialized, deserializer is missing`
      );
    }

    await this.queue.bind(this.exchange);

    await this.queue.activateConsumer(
      async (message) => {
        const event = this.deserializer!.deserialize(
          message.content.toString()
        );

        if (event) {
          const subscribers = this.subscribers.get(event.eventName);
          if (subscribers && subscribers.length) {
            const subscribersNames = subscribers.map(
              (subscriber) => subscriber.constructor.name
            );
            this.logger.info(
              `[${RabbitMQEventBus.name}] Message processed: ${event.eventName} by ${subscribersNames}`
            );
            const subscribersExecutions = subscribers.map((subscriber) =>
              subscriber.on(event)
            );
            await Promise.allSettled(subscribersExecutions);
          }
        }
        message.ack();
      },
      { noAck: false }
    );
  }

  addSubscribers(subscribers: DomainEventSubscriber<DomainEvent>[]): void {
    subscribers.forEach((subscriber) => {
      subscriber.subscribedTo().forEach((event) => {
        const eventName = event.EVENT_NAME;
        if (this.subscribers.has(eventName)) {
          this.subscribers.get(eventName)!.push(subscriber);
        } else {
          this.subscribers.set(eventName, [subscriber]);
        }
      });
    });
    this.setDomainEventMapping(new DomainEventMapping(subscribers));
  }

  async publish(events: DomainEvent[]): Promise<void> {
    const executions: any = [];
    events.map((event) => {
      const message = new Message({
        data: {
          id: event.eventId,
          type: event.eventName,
          occurred_on: event.occurredAt,
          attributes: event.toPrimitive()
        },
        meta: {}
      });
      this.logger.info(
        `[${RabbitMQEventBus.name}] Event to be published: ${event.eventName}`
      );
      executions.push(this.exchange.send(message));
    });

    await Promise.allSettled(executions);
  }

  private setDomainEventMapping(domainEventMapping: DomainEventMapping): void {
    this.deserializer = new DomainEventJSONDeserializer(domainEventMapping);
  }

  private openConnection = () => {
    this.logger.info(`[${RabbitMQEventBus.name}] started successfully`);
  };

  private errorConnection = (error: Error) => {
    this.logger.error({
      type: 'MESSAGE_BROKER_ERROR',
      message: `[${RabbitMQEventBus.name}] error connection: ${error.message}`,
      module: 'EVENT_BUS',
      level: 'error'
    });
  };

  private lostConnection = () => {
    this.logger.error({
      type: 'MESSAGE_BROKER_ERROR',
      message: `[${RabbitMQEventBus.name}] lost connection`,
      module: 'EVENT_BUS',
      level: 'error'
    });
  };
}
