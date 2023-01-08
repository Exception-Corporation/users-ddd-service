import { container } from '@container';
import { RequireContext } from '@/shared/infrastructure/auto-files/require.context';

const Controllers = RequireContext.getFiles(
  require.context('@/*', true, /^(?=.*\user.\bv1\b)(?=.*\bcontroller.ts\b).*$/),
  ['path', 'http']
);

export default Controllers.map((Controller: any) =>
  container.resolve(Controller)
);
