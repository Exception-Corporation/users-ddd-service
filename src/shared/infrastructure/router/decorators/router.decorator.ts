import { ControllerClass } from '@/shared/infrastructure/controller/decorators/controller';
import { LoggerMock } from '@/shared/infrastructure/logger/logger.mock';
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
  GlobalFunctions.verifyDuplicateValues(Controllers, ['http', 'path']);
  const logger = new LoggerMock();

  return (target: Function) => {
    logger.info(`\n\x1b[32m [ROUTER]: ${target.name} \x1b[0m\n`);
    logger.table(
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
