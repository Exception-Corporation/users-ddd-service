import 'reflect-metadata';
import { container } from '@/shared/infrastructure/container';
import { TYPES } from '@/shared/infrastructure/d-injection/types';
import { AppDependencies } from '@/shared/infrastructure/d-injection/config';
import { StartModule } from '@/shared/domain/bootstrap';
import config from '@/shared/infrastructure/config';

import { SharedBootstrap } from '@/shared/infrastructure/bootstrap';
import { UserBootstrap } from '@/user/v1/infrastructure/bootstrap';

export const modules = [SharedBootstrap, UserBootstrap];

if (!config.test.isDefined) {
  // Register dependencies
  new AppDependencies(container).register();
  // Initialize modules
  for (const Bootstrap of container.getAll<StartModule>(TYPES.StartModule)) {
    Bootstrap.init();
  }
}
