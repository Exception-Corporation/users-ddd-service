import { RequireService } from '@/shared/infrastructure/auto-files/';
import { AppContainer } from '@/shared/infrastructure/d-injection/container';

const Controllers = RequireService.getFiles(
  require.context('@/*', true, /^((?!!+).)*controller.ts$/),
  ['path', 'http']
);

export default Controllers.map((Controller: any) =>
  AppContainer.resolve(Controller)
);
