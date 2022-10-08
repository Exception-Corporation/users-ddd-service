import { logError, logSuccess, Logger } from "../../domain/logger";

export class LoggerMock implements Logger {
  info(message: string): void {
    console.info(message);
  }
  warn(message: string): void {
    console.warn(message);
  }
  error(message: logError): void {
    console.error(message);
  }
  success(message: logSuccess): void {
    console.info(message);
  }
  debug(message: string): void {
    console.info(message);
  }
}
