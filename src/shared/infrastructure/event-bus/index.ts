import { EventBus } from '@/shared/domain/event-bus/event.bus';
import { RabbitMQEventBus } from '@/shared/infrastructure/event-bus/rabbitmq/rabbitmq.event.bus';
import { MainLogger } from '@/shared/infrastructure/logger/main/';
import config from '@/shared/infrastructure/config';

const { user, password, host, port, queue, exchange } = config.buses.rabbitmq;

export const MainEventBus: EventBus = new RabbitMQEventBus(MainLogger, {
  user,
  password,
  host,
  port,
  queue,
  exchange,
  retries: 5,
  interval: 60
});
