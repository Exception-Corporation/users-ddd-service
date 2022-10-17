import { LoggerMock } from "@/shared/infrastructure/logger/main/logger.mock";
import { Logger } from "@/shared/domain/logger";

export const MainLogger: Logger = new LoggerMock();
