import { RequireContext } from '@/shared/infrastructure/auto-files/require.context';
import { container } from '@/shared/infrastructure/container';

const Controllers = RequireContext.getFiles(
  require.context('@/*', true, /^(?=.*\user.\bv1\b)(?=.*\bcontroller.ts\b).*$/),
  ['path', 'http']
);

export default Controllers.map((Controller: any) =>
  container.resolve(Controller)
);
