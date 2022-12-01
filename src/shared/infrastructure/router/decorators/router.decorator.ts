import { ControllerClass } from '@/shared/infrastructure/controller/decorators/controller';
import { MainLogger } from '@/shared/infrastructure/logger/main';
import { GlobalFunctions } from '@/shared/infrastructure/utils/global.functions';

export function Routes({
  path,
  Controllers
}: {
  path: string;
  Controllers: Array<
    ControllerClass & { isAuth?: boolean; roles?: Array<string> }
  >;
}) {
  GlobalFunctions.verifyDuplicationValues(Controllers, ['http', 'path']);

  return (target: Function) => {
    MainLogger.info(`\n\x1b[32m [ROUTER]: ${target.name} \x1b[0m\n`);
    MainLogger.table(
      Controllers.map((controller) => ({
        HTTP: controller.http.toUpperCase(),
        ENDPOINT: `${path}${controller.path}`,
        AUTHENITCATION: Boolean(controller.isAuth),
        ROLES: controller.roles || []
      }))
    );

    target.prototype.path = path;
  };
}
