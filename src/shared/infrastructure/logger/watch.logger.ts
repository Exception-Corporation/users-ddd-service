// creat a class
import { logError, Logger } from "../../domain/logger";
import { LoggerMock } from "./logger.mock";
import config from "../config";

export class WatchLogger {
  // constructor
  private static logger: Logger = new LoggerMock();
  // Logs
  static registerLog(logErrorMessage: logError) {
    this.logger.error(logErrorMessage);
    if (config.project.mode === "production") {
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
