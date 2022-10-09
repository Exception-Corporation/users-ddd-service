import { WatchLogger } from "@/shared/infrastructure/logger/watch.logger";

type Exception = {
  module: string;
  codeStatus: number;
  type: string;
  message: string;
};

type ExceptionDomain = {
  type: string;
  message: string;
};

export abstract class BaseController {
  protected mapperException(
    res: any,
    exception: any,
    params: object,
    exceptionsDomain: Array<ExceptionDomain>,
    module: string
  ): any {
    let body: Exception;

    const foundException = exceptionsDomain.find(
      (exceptionItem: ExceptionDomain) =>
        exceptionItem.type === (exception?.type || exception)
    );

    if (foundException) {
      body = {
        module,
        codeStatus: 500,
        type: foundException.type,
        message: `${foundException.message}: ${
          `${exception?.message}` || foundException.message || exception
        }`,
      };
    } else {
      switch (exception) {
        case "badRequest":
          body = {
            module: "global",
            codeStatus: 400,
            type: "API_BAD_REQUEST",
            message: `Bad request: ${exception}`,
          };
          break;
        case "unauthorized":
          body = {
            module: "global",
            codeStatus: 401,
            type: "API_INTERNAL_SERVER_ERROR",
            message: `Unauthorized: ${exception}`,
          };
          break;
        case "forbidden":
          body = {
            module: "global",
            codeStatus: 403,
            type: "API_FORBIDDEN",
            message: `Forbidden: ${exception}`,
          };
          break;
        case "notFound":
          body = {
            module: "global",
            codeStatus: 404,
            type: "API_NOT_FOUND",
            message: `Not found: ${exception}`,
          };
          break;
        case "unsupported":
          body = {
            module: "global",
            codeStatus: 405,
            type: "API_UNSUPPORTED",
            message: `Unsupported: ${exception}`,
          };
          break;
        case "invalid":
          body = {
            module: "global",
            codeStatus: 422,
            type: "API_INVALID",
            message: `Invalid: ${exception}`,
          };
          break;
        default:
          body = {
            module: "global",
            codeStatus: 500,
            type: "API_INTERNAL_SERVER_ERROR",
            message: `Internal Server Error: ${exception}`,
          };
          break;
      }
    }

    WatchLogger.registerLog({
      type: "CONTROLLER_ERROR",
      message: JSON.stringify(body),
      module: "CONTROLLER",
      level: "error",
      params: params,
    });

    res.status(body.codeStatus).send(body);
  }
}
