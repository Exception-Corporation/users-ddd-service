import 'reflect-metadata';
import { TYPES } from '@/shared/infrastructure/d-injection/types';
import { AppContainer } from '@/shared/infrastructure/d-injection/container';
import { AppDependencies } from '@/shared/infrastructure/d-injection/config';
import { StartModule } from '@/shared/domain/bootstrap';
import config from '@/shared/infrastructure/config';

import { SharedBootstrap } from '@/shared/infrastructure/bootstrap';
import { UserBootstrap } from '@/user/v1/infrastructure/bootstrap';

export const modules = [SharedBootstrap, UserBootstrap];

if (!config.test.isDefined) {
  // Register dependencies
  new AppDependencies().register(AppContainer);
  // Initialize modules
  for (const Bootstrap of AppContainer.getAll<StartModule>(TYPES.StartModule)) {
    Bootstrap.init();
  }
}
