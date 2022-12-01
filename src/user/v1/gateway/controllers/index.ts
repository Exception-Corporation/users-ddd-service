import { RequireService } from '@/shared/infrastructure/auto-files/';
import { AppContainer } from '@/shared/infrastructure/d-injection/container';

const Controllers = RequireService.getFiles(
  'src/user/v1/gateway/controllers/*.controller.ts',
  ['path', 'http']
);

export default Controllers.map((Controller: any) =>
  AppContainer.resolve(Controller)
);
