import { provide as InversifyProvide } from '@/shared/infrastructure/container/inversify/decorators/provider';
import { injectable as InversifyInjectable } from '@/shared/infrastructure/container/inversify/decorators/injectable';
import { inject as InversifyInject } from '@/shared/infrastructure/container/inversify/decorators/inject';
import { InversifyContainer } from '@/shared/infrastructure/container/inversify';

export const provide = InversifyProvide;
export const inject = InversifyInject;
export const injectable = InversifyInjectable;
export const container = InversifyContainer.getInstance();
