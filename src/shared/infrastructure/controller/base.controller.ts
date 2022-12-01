import { injectable } from 'inversify';
import { WatchLogger } from '@/shared/infrastructure/logger/watch.logger';
import { DomainErrorToHttpStatus } from '@/shared/domain/errors/lib/DomainErrorToHttpStatus';
import { DomainError } from '@/shared/domain/errors/lib/DomainError';
import {
  Context,
  ControllerResponse
} from '@/shared/infrastructure/controller/decorators/controller';

type Exception = {
  type: string;
  message: string;
};

@injectable()
export abstract class BaseController {
  protected mapperException(
    exception: DomainError,
    params: object,
    module: string
  ): ControllerResponse {
    let body: Exception;

    switch (exception.type) {
      case 'badRequest':
        body = {
          type: 'API_BAD_REQUEST',
          message: `Bad request: ${exception.message}`
        };
        break;
      case 'unauthorized':
        body = {
          type: 'API_INTERNAL_SERVER_ERROR',
          message: `Unauthorized: ${exception.message}`
        };
        break;
      case 'forbidden':
        body = {
          type: 'API_FORBIDDEN',
          message: `Forbidden: ${exception.message}`
        };
        break;
      case 'notFound':
        body = {
          type: 'API_NOT_FOUND',
          message: `Not found: ${exception.message}`
        };
        break;
      case 'unsupported':
        body = {
          type: 'API_UNSUPPORTED',
          message: `Unsupported: ${exception.message}`
        };
        break;
      case 'invalid':
        body = {
          type: 'API_INVALID',
          message: `Invalid: ${exception.message}`
        };
        break;
      default:
        body = {
          type: 'API_INTERNAL_SERVER_ERROR',
          message: `Internal Server Error: ${exception.message}`
        };
        break;
    }

    WatchLogger.registerLog({
      type: 'CONTROLLER_ERROR',
      message: JSON.stringify(body),
      module,
      level: 'error',
      params: params
    });
    return {
      status: DomainErrorToHttpStatus[exception.domainErrorCode],
      response: { success: false, module: 'global', ...body }
    };
  }

  abstract execute(context: Context): Promise<ControllerResponse>;
}
