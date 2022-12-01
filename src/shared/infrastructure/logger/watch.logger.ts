// creat a class
import { logError, Logger } from '@/shared/domain/logger';
import { LoggerMock } from '@/shared/infrastructure/logger/logger.mock';
import config from '@/shared/infrastructure/config';

export class WatchLogger {
  // constructor
  private static logger: Logger = new LoggerMock();
  //private static airBrake: AirBrakeLogger;
  //private static dataDog: DataDogLogger = new DataDogLogger();
  // Logs
  static registerLog(logErrorMessage: logError) {
    this.logger.error(logErrorMessage);
    if (config.project.mode === 'production') {
      // this.airBrake == new AirBrakeLogger();
      // this.airBrake.registerLog(logErrorMessage);
    }
  }

  static registerLogByWrap(content: any) {
    //return this.airBrake.registerLogByWrap(content);
  }

  static registerTracer() {
    //return this.dataDog.registerTracer();
  }
}
