import { DomainErrorCode } from '@/shared/domain/errors/lib/DomainErrorCode';
import HttpStatus from '@/shared/domain/errors/lib/HttpStatus';

export const DomainErrorToHttpStatus: Record<DomainErrorCode, HttpStatus> = {
  [DomainErrorCode.ID_PATH_PARAMETER_MISSING]: HttpStatus.BAD_REQUEST,
  [DomainErrorCode.USER_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [DomainErrorCode.DTO_PROPERTIES_ERROR]: HttpStatus.BAD_REQUEST,
  [DomainErrorCode.INVALID_CREDENTIALS]: HttpStatus.BAD_REQUEST,
  [DomainErrorCode.DATABASE_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR
};
