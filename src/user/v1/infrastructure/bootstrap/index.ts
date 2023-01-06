import { inject, injectable } from '@container';
import { container } from '@/shared/infrastructure/container';
import { TYPES } from '@/shared/infrastructure/d-injection/types';
import { StartModule } from '@/shared/domain/bootstrap';
import { Logger } from '@/shared/domain/logger';
import { UserContainerModule } from '@/user/v1/infrastructure/d-injection/config';

export const moduleName = 'user/v1';

@injectable()
export class UserBootstrap implements StartModule {
  constructor(@inject(TYPES.Logger) private readonly logger: Logger) {}

  async init(): Promise<void> {
    try {
      // independency injection
      new UserContainerModule(container).register();

      this.logger.info(`[${moduleName}] Module started`);
    } catch (error) {
      this.logger.error({
        type: 'BOOTSTRAP_ERROR',
        message: `[${moduleName}] Error [${error}]`,
        module: 'USER',
        level: 'error'
      });
    }
  }
}
