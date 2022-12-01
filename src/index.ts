import 'reflect-metadata';
import { buildProviderModule } from 'inversify-binding-decorators';
import { TYPES } from '@/shared/infrastructure/d-injection/types';
import { AppContainer } from '@/shared/infrastructure/d-injection/container';
import { AppDependencies } from '@/shared/infrastructure/d-injection/config';
import { StartModule } from '@/shared/domain/bootstrap';
import config from '@/shared/infrastructure/config';

import { SharedBootstrap } from '@/shared/infrastructure/bootstrap';

export const modules = [SharedBootstrap];

if (!config.test.isDefined) {
  // Register dependencies
  new AppDependencies().register(AppContainer);
  // Initialize modules
  for (const Bootstrap of AppContainer.getAll<StartModule>(TYPES.StartModule)) {
    Bootstrap.init();
  }
}

AppContainer.load(buildProviderModule());
