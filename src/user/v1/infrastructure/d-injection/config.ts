import { ContainerModule, interfaces } from 'inversify';

import { TYPES } from '@/user/v1/infrastructure/d-injection/types';
import { TYPES as TYPES_SHARED } from '@/shared/infrastructure/d-injection/types';

import { DomainEvent } from '@/shared/domain/event-bus/domain.event';
import { DomainEventSubscriber } from '@/shared/domain/event-bus/domain.event.subscriber';

import { UserEmailEvent } from '@/user/v1/gateway/events/user.email.event';
import { UserRepository } from '@/user/v1/domain/repositories/user.repository';
import { UserPostgreseRepository } from '@/user/v1/infrastructure/repositories/user.postgres.repository';

import { RequestAdapter } from '@/user/v1/infrastructure/adapters/request.adapter';
import { IRequestAdapter } from '@/shared/domain/interfaces/request.adapter';

export const UserContainerModule = new ContainerModule(
  (bind: interfaces.Bind, _unbind: interfaces.Unbind) => {
    // event-subscribers
    bind<DomainEventSubscriber<DomainEvent>>(
      TYPES_SHARED.DomainEventSubscriber
    ).to(UserEmailEvent);

    bind<UserRepository>(TYPES.UserRepository).to(UserPostgreseRepository);

    bind<IRequestAdapter>(TYPES.IRequestAdapter).to(RequestAdapter);
  }
);
