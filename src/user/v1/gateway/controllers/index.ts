import { RequireContext } from '@/shared/infrastructure/auto-files/require.context';
import { AppContainer } from '@/shared/infrastructure/d-injection/container';

const Controllers = RequireContext.getFiles(
  require.context('@/*', true, /^(?=.*\user.\bv1\b)(?=.*\bcontroller.ts\b).*$/),
  ['path', 'http']
);

export default Controllers.map((Controller: any) =>
  AppContainer.resolve(Controller)
);
