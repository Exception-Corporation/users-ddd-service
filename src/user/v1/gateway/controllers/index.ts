import { RequireService } from '@/shared/infrastructure/auto-files/';

const Controllers = RequireService.getFiles(
  'src/user/v1/gateway/controllers/*.controller.ts'
);

export default Controllers.map((Controller: any) => {
  const controller = new Controller();

  return controller;
}).filter(
  (controller: { path: string; http: string }) =>
    controller.path !== undefined && controller.http !== undefined
);
