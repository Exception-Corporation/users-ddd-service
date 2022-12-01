import { injectable } from 'inversify';
import { logError, logSuccess, Logger } from '@/shared/domain/logger';

@injectable()
export class LoggerMock implements Logger {
  table(message: Array<any>): void {
    console.table(message);
  }

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
