import { RequireService } from '@/shared/infrastructure/auto-files/';

const Controllers = RequireService.getFiles(
  'src/user/v1/gateway/controllers/*.controller.ts',
  ['path', 'http']
);

export default Controllers.map((Controller: any) => {
  const controller = new Controller();

  return controller;
});
