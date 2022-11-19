import { DomainError } from '@/shared/domain/errors/lib/DomainError';
import { DomainErrorCode } from '@/shared/domain/errors/lib/DomainErrorCode';

export class InternalError extends DomainError {
  public domainErrorCode = DomainErrorCode.INTERNAL_ERROR;

  constructor(message: string) {
    super(`INTERNAL GENERAL ERROR: ${message}`, 'unsupported');
  }
}
